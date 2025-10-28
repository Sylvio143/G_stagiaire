package com.example.back_gestion_Stage.Entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "stages")
@Data
@EqualsAndHashCode(callSuper = true)
public class Stage extends BaseEntity {
    @Column(nullable = false)
    private String titre;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "date_debut", nullable = false)
    private LocalDate dateDebut;
    
    @Column(name = "date_fin", nullable = false)
    private LocalDate dateFin;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutStage statut = StatutStage.EN_ATTENTE_VALIDATION;
    
    // Relation directe avec l'encadreur
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "encadreur_document_id", referencedColumnName = "documentId")
    private Encadreur encadreur;
    
    // Relation directe avec le supérieur hiérarchique
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "superieur_document_id", referencedColumnName = "documentId")
    private SuperieurHierarchique superieurHierarchique;
    
    // Relation DIRECTE avec les stagiaires (Many-to-Many)
    @ManyToMany
    @JoinTable(
        name = "stage_stagiaires",
        joinColumns = @JoinColumn(name = "stage_document_id", referencedColumnName = "documentId"),
        inverseJoinColumns = @JoinColumn(name = "stagiaire_document_id", referencedColumnName = "documentId")
    )
    private List<Stagiaire> stagiaires = new ArrayList<>();
    
    // Relation avec les tâches
    @OneToMany(mappedBy = "stage", cascade = CascadeType.ALL)
    private List<Tache> taches = new ArrayList<>();
    
    public enum StatutStage {
        EN_ATTENTE_VALIDATION,
        VALIDE,
        REFUSE,
        EN_COURS,
        TERMINE
    }
    
    // Méthode utilitaire pour ajouter un stagiaire
    public void addStagiaire(Stagiaire stagiaire) {
        if (this.stagiaires == null) {
            this.stagiaires = new ArrayList<>();
        }
        this.stagiaires.add(stagiaire);
    }
    
    // Méthode utilitaire pour retirer un stagiaire
    public void removeStagiaire(Stagiaire stagiaire) {
        if (this.stagiaires != null) {
            this.stagiaires.remove(stagiaire);
        }
    }
}
