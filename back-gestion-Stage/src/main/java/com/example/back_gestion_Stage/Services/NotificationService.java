package com.example.back_gestion_Stage.Services;

import com.example.back_gestion_Stage.Entities.Notification;
import com.example.back_gestion_Stage.DTOs.NotificationDTO;
import com.example.back_gestion_Stage.Repositories.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class NotificationService extends BaseService<Notification, NotificationDTO> {

    @Autowired
    private NotificationRepository notificationRepository;

    @Override
    protected NotificationRepository getRepository() {
        return notificationRepository;
    }

    @Override
    protected NotificationDTO convertToDto(Notification entity) {
        NotificationDTO dto = new NotificationDTO();
        dto.setId(entity.getId());
        dto.setDocumentId(entity.getDocumentId());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        dto.setTitre(entity.getTitre());
        dto.setMessage(entity.getMessage());
        dto.setType(entity.getType());
        dto.setLue(entity.isLue());
        dto.setDocumentIdReference(entity.getDocumentIdReference());
        dto.setTypeReference(entity.getTypeReference());
        dto.setCompteUtilisateurDocumentId(entity.getCompteUtilisateurDocumentId());
        return dto;
    }

    @Override
    protected Notification convertToEntity(NotificationDTO dto) {
        Notification entity = new Notification();
        entity.setId(dto.getId());
        entity.setDocumentId(dto.getDocumentId());
        entity.setTitre(dto.getTitre());
        entity.setMessage(dto.getMessage());
        entity.setType(dto.getType());
        entity.setLue(dto.isLue());
        entity.setDocumentIdReference(dto.getDocumentIdReference());
        entity.setTypeReference(dto.getTypeReference());
        entity.setCompteUtilisateurDocumentId(dto.getCompteUtilisateurDocumentId());
        return entity;
    }

    // NOUVELLE MÉTHODE POUR LA MISE À JOUR
    @Override
    protected void updateEntityFromDto(Notification entity, NotificationDTO dto) {
        if (dto.getTitre() != null) entity.setTitre(dto.getTitre());
        if (dto.getMessage() != null) entity.setMessage(dto.getMessage());
        if (dto.getType() != null) entity.setType(dto.getType());
        entity.setLue(dto.isLue());
        if (dto.getDocumentIdReference() != null) entity.setDocumentIdReference(dto.getDocumentIdReference());
        if (dto.getTypeReference() != null) entity.setTypeReference(dto.getTypeReference());
        if (dto.getCompteUtilisateurDocumentId() != null) entity.setCompteUtilisateurDocumentId(dto.getCompteUtilisateurDocumentId());
        // Ne pas mettre à jour : id, documentId, createdAt, updatedAt
    }

    @Override
    public Optional<NotificationDTO> findByDocumentId(String documentId) {
        return notificationRepository.findByDocumentId(documentId)
                .map(this::convertToDto);
    }

    public List<NotificationDTO> findByCompteUtilisateurDocumentId(String compteUtilisateurDocumentId) {
        return notificationRepository.findByCompteUtilisateurDocumentIdOrderByDateDesc(compteUtilisateurDocumentId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<NotificationDTO> findByCompteUtilisateurDocumentIdAndNonLues(String compteUtilisateurDocumentId) {
        return notificationRepository.findByCompteUtilisateurDocumentIdAndLue(compteUtilisateurDocumentId, false)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<NotificationDTO> findByType(Notification.TypeNotification type) {
        return notificationRepository.findByType(type)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<NotificationDTO> findByTypeReferenceAndDocumentIdReference(String typeReference, String documentIdReference) {
        return notificationRepository.findByTypeReferenceAndDocumentIdReference(typeReference, documentIdReference)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public NotificationDTO marquerCommeLue(String documentId) {
        Optional<Notification> notificationOpt = notificationRepository.findByDocumentId(documentId);
        if (notificationOpt.isPresent()) {
            Notification notification = notificationOpt.get();
            notification.setLue(true);
            Notification savedNotification = notificationRepository.save(notification);
            return convertToDto(savedNotification);
        }
        throw new RuntimeException("Notification non trouvée");
    }

    public void marquerToutesCommeLues(String compteUtilisateurDocumentId) {
        notificationRepository.marquerToutesCommeLues(compteUtilisateurDocumentId);
    }

    public Long countNonLuesByCompteUtilisateurDocumentId(String compteUtilisateurDocumentId) {
        return notificationRepository.countByCompteUtilisateurDocumentIdAndNonLues(compteUtilisateurDocumentId);
    }

    public NotificationDTO createNotification(String titre, String message, Notification.TypeNotification type, 
                                           String compteUtilisateurDocumentId, String documentIdReference, String typeReference) {
        Notification notification = new Notification();
        notification.setTitre(titre);
        notification.setMessage(message);
        notification.setType(type);
        notification.setCompteUtilisateurDocumentId(compteUtilisateurDocumentId);
        notification.setDocumentIdReference(documentIdReference);
        notification.setTypeReference(typeReference);
        notification.setLue(false);

        Notification savedNotification = notificationRepository.save(notification);
        return convertToDto(savedNotification);
    }

    @Override
    public void deleteByDocumentId(String documentId) {
        notificationRepository.findByDocumentId(documentId)
                .ifPresent(notification -> notificationRepository.deleteById(notification.getId()));
    }

    public void deleteOldNotifications(int daysOld) {
        // Implémentation pour supprimer les notifications anciennes
        // Cette méthode nécessiterait un champ de date supplémentaire ou utiliser createdAt
    }

    public long countTotalNotifications() {
        return notificationRepository.count();
    }

    public long countByType(Notification.TypeNotification type) {
        return notificationRepository.findByType(type).size();
    }
}