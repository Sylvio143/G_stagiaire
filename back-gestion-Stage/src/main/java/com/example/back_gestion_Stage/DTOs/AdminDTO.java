package com.example.back_gestion_Stage.DTOs;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class AdminDTO extends BaseDTO {
    private String nom;
    private String prenom;
    private String email;
    private String telephone;
    private String cin;
    private String fonction = "Administrateur";
}