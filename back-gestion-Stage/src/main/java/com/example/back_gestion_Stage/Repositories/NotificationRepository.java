package com.example.back_gestion_Stage.Repositories;

import com.example.back_gestion_Stage.Entities.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    Optional<Notification> findByDocumentId(String documentId);
    List<Notification> findByCompteUtilisateurDocumentId(String compteUtilisateurDocumentId);
    List<Notification> findByCompteUtilisateurDocumentIdAndLue(String compteUtilisateurDocumentId, boolean lue);
    List<Notification> findByType(Notification.TypeNotification type);
    List<Notification> findByTypeReferenceAndDocumentIdReference(String typeReference, String documentIdReference);
    
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.compteUtilisateurDocumentId = :compteUtilisateurDocumentId AND n.lue = false")
    Long countByCompteUtilisateurDocumentIdAndNonLues(String compteUtilisateurDocumentId);
    
    @Modifying
    @Query("UPDATE Notification n SET n.lue = true WHERE n.compteUtilisateurDocumentId = :compteUtilisateurDocumentId AND n.lue = false")
    void marquerToutesCommeLues(String compteUtilisateurDocumentId);
    
    @Query("SELECT n FROM Notification n WHERE n.compteUtilisateurDocumentId = :compteUtilisateurDocumentId ORDER BY n.createdAt DESC")
    List<Notification> findByCompteUtilisateurDocumentIdOrderByDateDesc(String compteUtilisateurDocumentId);
}