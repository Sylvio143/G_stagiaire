package com.example.back_gestion_Stage.Entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "notifications")
@Data
@EqualsAndHashCode(callSuper = true)
public class Notification extends BaseEntity {
    @Column(nullable = false)
    private String titre;
    
    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeNotification type;
    
    @Column(nullable = false)
    private boolean lue = false;
    
    @Column(name = "document_id_reference")
    private String documentIdReference;
    
    @Column(name = "type_reference")
    private String typeReference;
    
    @Column(name = "compte_utilisateur_document_id")
    private String compteUtilisateurDocumentId;
    
    public enum TypeNotification {
        NOUVEAU_STAGE,
        STAGE_VALIDE,
        STAGE_REFUSE,
        NOUVELLE_TACHE,
        RAPPEL_TACHE,
        MESSAGE_IMPORTANT,
        COMPTE_ACTIVE
    }
}
