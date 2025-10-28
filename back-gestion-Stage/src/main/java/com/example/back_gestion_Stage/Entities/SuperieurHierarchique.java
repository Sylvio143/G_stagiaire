package com.example.back_gestion_Stage.Entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "superieurs_hierarchiques")
@Data
@EqualsAndHashCode(callSuper = true)
public class SuperieurHierarchique extends BaseEntity {
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
    
    @Column(nullable = false)
    private String fonction;
    
    private String departement;
    
    // Relation ONE-TO-ONE pour la photo de profil
    @OneToOne(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
        @JoinColumn(name = "photo_document_id", referencedColumnName = "documentId")
        private MediaFile photo;
    
    @OneToMany(mappedBy = "superieurHierarchique", cascade = CascadeType.ALL)
    private List<Encadreur> encadreurs = new ArrayList<>();
    
    @OneToMany(mappedBy = "superieurHierarchique", cascade = CascadeType.ALL)
    private List<Stage> stages = new ArrayList<>();
    
    // Méthodes utilitaires
    public String getPhotoUrl() {
        return this.photo != null ? this.photo.getUrl() : null;
    }
    
    public String getThumbnailUrl() {
        return this.photo != null ? this.photo.getThumbnailUrl() : null;
    }
    
    public String getMediumPhotoUrl() {
        return this.photo != null ? this.photo.getMediumUrl() : null;
    }
}