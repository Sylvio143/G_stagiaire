package com.example.back_gestion_Stage.Entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Entity
@Table(name = "taches")
@Data
@EqualsAndHashCode(callSuper = true)
public class Tache extends BaseEntity {
    @Column(nullable = false)
    private String titre;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "date_debut")
    private LocalDateTime dateDebut;
    
    @Column(name = "date_fin")
    private LocalDateTime dateFin;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutTache statut = StatutTache.A_FAIRE;
    
    // Nouveau champ priorité avec valeur par défaut
    @Column(nullable = false)
    private Integer priorite = 3; // 1 = Haute, 2 = Moyenne, 3 = Basse
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stage_document_id", referencedColumnName = "documentId")
    private Stage stage;
    
    public enum StatutTache {
        A_FAIRE,
        EN_COURS,
        TERMINEE,
        ANNULEE
    }
    
    // Méthode utilitaire pour obtenir le libellé de la priorité
    public String getPrioriteLabel() {
        switch (this.priorite) {
            case 1: return "HAUTE";
            case 2: return "MOYENNE";
            case 3: return "BASSE";
            default: return "NON_DEFINIE";
        }
    }
    
    // Méthode pour vérifier si la tâche est en retard
    public boolean isEnRetard() {
        return this.dateFin != null && 
               this.dateFin.isBefore(LocalDateTime.now()) && 
               this.statut != StatutTache.TERMINEE;
    }
}