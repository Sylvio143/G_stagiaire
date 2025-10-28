package com.example.back_gestion_Stage.Repositories;

import com.example.back_gestion_Stage.Entities.MediaFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface MediaFileRepository extends JpaRepository<MediaFile, Long> {
    
    // Trouver par documentId
    Optional<MediaFile> findByDocumentId(String documentId);
    
    // Trouver par nom de fichier
    Optional<MediaFile> findByName(String name);
    
    // Trouver par URL
    Optional<MediaFile> findByUrl(String url);
    
    // Trouver par type MIME
    List<MediaFile> findByMime(String mime);
    
    // Trouver par provider
    List<MediaFile> findByProvider(String provider);
    
    // Trouver les fichiers par extension
    List<MediaFile> findByExt(String ext);
    
    // Trouver les fichiers images (commençant par "image/")
    @Query("SELECT m FROM MediaFile m WHERE m.mime LIKE 'image/%'")
    List<MediaFile> findAllImages();
    
    // Trouver les fichiers PDF
    @Query("SELECT m FROM MediaFile m WHERE m.mime = 'application/pdf'")
    List<MediaFile> findAllPdfs();
    
    // Trouver les fichiers par taille (supérieure à)
    @Query("SELECT m FROM MediaFile m WHERE m.size > :minSize")
    List<MediaFile> findBySizeGreaterThan(Double minSize);
    
    // Trouver les fichiers par taille (inférieure à)
    @Query("SELECT m FROM MediaFile m WHERE m.size < :maxSize")
    List<MediaFile> findBySizeLessThan(Double maxSize);
    
    // Trouver les fichiers par plage de taille
    @Query("SELECT m FROM MediaFile m WHERE m.size BETWEEN :minSize AND :maxSize")
    List<MediaFile> findBySizeBetween(Double minSize, Double maxSize);
    
    // Vérifier l'existence par nom
    boolean existsByName(String name);
    
    // Vérifier l'existence par URL
    boolean existsByUrl(String url);
    
    // Compter les fichiers par type MIME
    Long countByMime(String mime);
    
    // Supprimer par documentId
    void deleteByDocumentId(String documentId);
}