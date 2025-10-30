package com.example.back_gestion_Stage.Services;

import com.example.back_gestion_Stage.Entities.MediaFile;
import com.example.back_gestion_Stage.DTOs.MediaFileDTO;
import com.example.back_gestion_Stage.Repositories.MediaFileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class MediaFileService extends BaseService<MediaFile, MediaFileDTO> {

    @Autowired
    private MediaFileRepository mediaFileRepository;

    private final String UPLOAD_DIR = "uploads/";

    @Override
    protected MediaFileRepository getRepository() {
        return mediaFileRepository;
    }

    @Override
    protected MediaFileDTO convertToDto(MediaFile entity) {
        MediaFileDTO dto = new MediaFileDTO();
        dto.setId(entity.getId());
        dto.setDocumentId(entity.getDocumentId());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        dto.setName(entity.getName());
        dto.setAlternativeText(entity.getAlternativeText());
        dto.setCaption(entity.getCaption());
        dto.setWidth(entity.getWidth());
        dto.setHeight(entity.getHeight());
        dto.setExt(entity.getExt());
        dto.setMime(entity.getMime());
        dto.setSize(entity.getSize());
        dto.setUrl(entity.getUrl());
        dto.setProvider(entity.getProvider());
        dto.setThumbnailUrl(entity.getThumbnailUrl());
        dto.setMediumUrl(entity.getMediumUrl());
        return dto;
    }

    @Override
    protected MediaFile convertToEntity(MediaFileDTO dto) {
        MediaFile entity = new MediaFile();
        entity.setId(dto.getId());
        entity.setDocumentId(dto.getDocumentId());
        entity.setName(dto.getName());
        entity.setAlternativeText(dto.getAlternativeText());
        entity.setCaption(dto.getCaption());
        entity.setWidth(dto.getWidth());
        entity.setHeight(dto.getHeight());
        entity.setExt(dto.getExt());
        entity.setMime(dto.getMime());
        entity.setSize(dto.getSize());
        entity.setUrl(dto.getUrl());
        entity.setProvider(dto.getProvider());
        entity.setThumbnailUrl(dto.getThumbnailUrl());
        entity.setMediumUrl(dto.getMediumUrl());
        return entity;
    }

    // NOUVELLE MÉTHODE POUR LA MISE À JOUR
    @Override
    protected void updateEntityFromDto(MediaFile entity, MediaFileDTO dto) {
        if (dto.getName() != null) entity.setName(dto.getName());
        if (dto.getAlternativeText() != null) entity.setAlternativeText(dto.getAlternativeText());
        if (dto.getCaption() != null) entity.setCaption(dto.getCaption());
        if (dto.getWidth() != null) entity.setWidth(dto.getWidth());
        if (dto.getHeight() != null) entity.setHeight(dto.getHeight());
        if (dto.getExt() != null) entity.setExt(dto.getExt());
        if (dto.getMime() != null) entity.setMime(dto.getMime());
        if (dto.getSize() != null) entity.setSize(dto.getSize());
        if (dto.getUrl() != null) entity.setUrl(dto.getUrl());
        if (dto.getProvider() != null) entity.setProvider(dto.getProvider());
        if (dto.getThumbnailUrl() != null) entity.setThumbnailUrl(dto.getThumbnailUrl());
        if (dto.getMediumUrl() != null) entity.setMediumUrl(dto.getMediumUrl());
        // Ne pas mettre à jour : id, documentId, createdAt, updatedAt
    }
    @Override
    public Optional<MediaFileDTO> findByDocumentId(String documentId) {
        return mediaFileRepository.findByDocumentId(documentId)
                .map(this::convertToDto);
    }

    public Optional<MediaFileDTO> findByName(String name) {
        return mediaFileRepository.findByName(name)
                .map(this::convertToDto);
    }

    public Optional<MediaFileDTO> findByUrl(String url) {
        return mediaFileRepository.findByUrl(url)
                .map(this::convertToDto);
    }

    public List<MediaFileDTO> findByMime(String mime) {
        return mediaFileRepository.findByMime(mime)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<MediaFileDTO> findAllImages() {
        return mediaFileRepository.findAllImages()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<MediaFileDTO> findAllPdfs() {
        return mediaFileRepository.findAllPdfs()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<MediaFileDTO> findBySizeGreaterThan(Double minSize) {
        return mediaFileRepository.findBySizeGreaterThan(minSize)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<MediaFileDTO> findBySizeLessThan(Double maxSize) {
        return mediaFileRepository.findBySizeLessThan(maxSize)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public boolean existsByName(String name) {
        return mediaFileRepository.existsByName(name);
    }

    public boolean existsByUrl(String url) {
        return mediaFileRepository.existsByUrl(url);
    }

    public Long countByMime(String mime) {
        return mediaFileRepository.countByMime(mime);
    }

    @Override
    public void deleteByDocumentId(String documentId) {
        mediaFileRepository.findByDocumentId(documentId)
                .ifPresent(mediaFile -> {
                    // Supprimer le fichier physique du système de fichiers
                    deletePhysicalFile(mediaFile.getUrl());
                    if (mediaFile.getThumbnailUrl() != null) {
                        deletePhysicalFile(mediaFile.getThumbnailUrl());
                    }
                    if (mediaFile.getMediumUrl() != null) {
                        deletePhysicalFile(mediaFile.getMediumUrl());
                    }
                    // Supprimer l'entrée de la base de données
                    mediaFileRepository.deleteById(mediaFile.getId());
                });
    }

    /**
     * Méthode pour uploader un fichier
     */
    public MediaFileDTO uploadFile(MultipartFile file, String alternativeText, String caption) throws IOException {
        // Créer le répertoire s'il n'existe pas
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Générer un nom de fichier unique
        String originalFileName = file.getOriginalFilename();
        String fileExtension = getFileExtension(originalFileName);
        String uniqueFileName = UUID.randomUUID().toString() + "." + fileExtension;

        // Sauvegarder le fichier
        Path filePath = uploadPath.resolve(uniqueFileName);
        Files.copy(file.getInputStream(), filePath);

        // Créer l'entité MediaFile
        MediaFile mediaFile = new MediaFile();
        mediaFile.setName(originalFileName);
        mediaFile.setAlternativeText(alternativeText);
        mediaFile.setCaption(caption);
        mediaFile.setExt(fileExtension);
        mediaFile.setMime(file.getContentType());
        mediaFile.setSize((double) file.getSize() / 1024); // Taille en KB
        mediaFile.setUrl("/" + UPLOAD_DIR + uniqueFileName);
        mediaFile.setProvider("local");

        // Pour les images, générer les URLs pour les thumbnails et medium
        if (file.getContentType() != null && file.getContentType().startsWith("image/")) {
            // Ici vous pouvez ajouter la logique pour générer les thumbnails
            // Pour l'instant, on utilise la même URL
            mediaFile.setThumbnailUrl("/" + UPLOAD_DIR + "thumb_" + uniqueFileName);
            mediaFile.setMediumUrl("/" + UPLOAD_DIR + "medium_" + uniqueFileName);
        }

        MediaFile savedMediaFile = mediaFileRepository.save(mediaFile);
        return convertToDto(savedMediaFile);
    }

    /**
     * Méthode utilitaire pour obtenir l'extension d'un fichier
     */
    private String getFileExtension(String fileName) {
        if (fileName == null || fileName.lastIndexOf(".") == -1) {
            return "";
        }
        return fileName.substring(fileName.lastIndexOf(".") + 1);
    }

    /**
     * Méthode pour supprimer le fichier physique
     */
    private void deletePhysicalFile(String fileUrl) {
        try {
            if (fileUrl != null && fileUrl.startsWith("/")) {
                Path filePath = Paths.get(fileUrl.substring(1)); // Retirer le slash initial
                Files.deleteIfExists(filePath);
            }
        } catch (IOException e) {
            // Logger l'erreur mais ne pas arrêter l'exécution
            System.err.println("Erreur lors de la suppression du fichier physique: " + fileUrl);
        }
    }

    /**
     * Méthode pour obtenir les statistiques des fichiers
     */
    public MediaStats getMediaStats() {
        List<MediaFile> allFiles = mediaFileRepository.findAll();
        
        long totalFiles = allFiles.size();
        double totalSize = allFiles.stream().mapToDouble(MediaFile::getSize).sum();
        long imageCount = allFiles.stream()
                .filter(f -> f.getMime() != null && f.getMime().startsWith("image/"))
                .count();
        long pdfCount = allFiles.stream()
                .filter(f -> f.getMime() != null && f.getMime().equals("application/pdf"))
                .count();
        
        return new MediaStats(totalFiles, totalSize, imageCount, pdfCount);
    }

    // Classe interne pour les statistiques
    public static class MediaStats {
        private final long totalFiles;
        private final double totalSizeKB;
        private final long imageCount;
        private final long pdfCount;

        public MediaStats(long totalFiles, double totalSizeKB, long imageCount, long pdfCount) {
            this.totalFiles = totalFiles;
            this.totalSizeKB = totalSizeKB;
            this.imageCount = imageCount;
            this.pdfCount = pdfCount;
        }

        // Getters
        public long getTotalFiles() { return totalFiles; }
        public double getTotalSizeKB() { return totalSizeKB; }
        public double getTotalSizeMB() { return totalSizeKB / 1024; }
        public long getImageCount() { return imageCount; }
        public long getPdfCount() { return pdfCount; }
    }
}