package com.example.back_gestion_Stage.Entities;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "comptes_utilisateurs")
@Data
@EqualsAndHashCode(callSuper = true)
public class CompteUtilisateur extends BaseEntity {
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String motDePasse;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeCompte typeCompte;
    
    // Référence vers l'entité correspondante (Stagiaire, Encadreur, etc.)
    @Column(name = "entity_document_id")
    private String entityDocumentId;
    
    @Column(name = "entity_type")
    @Enumerated(EnumType.STRING)
    private TypeCompte entityType;
    
    public enum TypeCompte {
        ADMIN,
        ENCADREUR,
        SUPERIEUR_HIERARCHIQUE,
        STAGIAIRE
    }
}
