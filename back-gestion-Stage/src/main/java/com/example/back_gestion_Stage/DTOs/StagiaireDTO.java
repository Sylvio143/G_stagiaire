package com.example.back_gestion_Stage.DTOs;

import com.example.back_gestion_Stage.Entities.StatutEntite;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.time.LocalDate;

@Data
@EqualsAndHashCode(callSuper = true)
public class StagiaireDTO extends BaseDTO {
    private String nom;
    private String prenom;
    private String email;
    private String telephone;
    private String cin;
    private String ecole;
    private String filiere;
    private String niveauEtude;
    private LocalDate dateNaissance;
    private String adresse;
    private StatutEntite statut;
    private MediaFileDTO photo;
    private String encadreurDocumentId;
    private String photoUrl;
    private String thumbnailUrl;
    private String mediumPhotoUrl;
    private Boolean hasActiveStage;
}