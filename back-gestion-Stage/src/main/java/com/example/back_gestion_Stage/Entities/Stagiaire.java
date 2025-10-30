package com.example.back_gestion_Stage.Entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "stagiaires")
@Data
@EqualsAndHashCode(callSuper = true)
public class Stagiaire extends BaseEntity {
    @Column(nullable = false)
    private String nom;
    
    @Column(nullable = false)
    private String prenom;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String telephone;
    
    @Column(unique = true, nullable = false)
    private String cin;
    
    private String ecole;
    
    private String filiere;
    
    private String niveauEtude;
    
    @Column(name = "date_naissance")
    private LocalDate dateNaissance;
    
    private String adresse;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutEntite statut = StatutEntite.ACTIF;
    
    @OneToOne(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "photo_document_id", referencedColumnName = "documentId")
    private MediaFile photo;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "encadreur_document_id", referencedColumnName = "documentId")
    private Encadreur encadreur;
    
    @ManyToMany(mappedBy = "stagiaires")
    private List<Stage> stages = new ArrayList<>();
    
    public String getPhotoUrl() {
        return this.photo != null ? this.photo.getUrl() : null;
    }
    
    public String getThumbnailUrl() {
        return this.photo != null ? this.photo.getThumbnailUrl() : null;
    }
    
    public String getMediumPhotoUrl() {
        return this.photo != null ? this.photo.getMediumUrl() : null;
    }
    
    // CORRECTION: Mettre à jour les méthodes qui utilisaient statut
    public boolean hasActiveStage() {
        if (stages == null || stages.isEmpty()) {
            return false;
        }
        
        LocalDate now = LocalDate.now();
        return stages.stream()
                .anyMatch(stage -> 
                    stage.getStatutStage() == Stage.StatutStage.EN_COURS && // CHANGEMENT: getStatutStage()
                    !stage.getDateDebut().isAfter(now) &&
                    !stage.getDateFin().isBefore(now)
                );
    }
    
    // CORRECTION: Mettre à jour getCurrentStage
    public Stage getCurrentStage() {
        if (stages == null || stages.isEmpty()) {
            return null;
        }
        
        LocalDate now = LocalDate.now();
        return stages.stream()
                .filter(stage -> 
                    stage.getStatutStage() == Stage.StatutStage.EN_COURS && // CHANGEMENT: getStatutStage()
                    !stage.getDateDebut().isAfter(now) &&
                    !stage.getDateFin().isBefore(now)
                )
                .findFirst()
                .orElse(null);
    }
}