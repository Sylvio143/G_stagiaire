package com.example.back_gestion_Stage.DTOs;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class EncadreurDTO extends BaseDTO {
    private String nom;
    private String prenom;
    private String email;
    private String telephone;
    private String cin;
    private String fonction;
    private String departement;
    private String specialite;
    private MediaFileDTO photo;
    private String superieurHierarchiqueDocumentId;
    private String photoUrl;
    private String thumbnailUrl;
    private String mediumPhotoUrl;
}