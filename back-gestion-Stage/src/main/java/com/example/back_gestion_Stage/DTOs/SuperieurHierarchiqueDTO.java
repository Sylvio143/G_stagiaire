
package com.example.back_gestion_Stage.DTOs;

import com.example.back_gestion_Stage.Entities.StatutEntite;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class SuperieurHierarchiqueDTO extends BaseDTO {
    private String nom;
    private String prenom;
    private String email;
    private String telephone;
    private String cin;
    private String fonction;
    private String departement;
    private StatutEntite statut;
    private MediaFileDTO photo;
    private String photoUrl;
    private String thumbnailUrl;
    private String mediumPhotoUrl;
}