package com.example.back_gestion_Stage.DTOs;

import lombok.Data;
import lombok.EqualsAndHashCode;
import com.example.back_gestion_Stage.Entities.CompteUtilisateur;

@Data
@EqualsAndHashCode(callSuper = true)
public class CompteUtilisateurDTO extends BaseDTO {
    private String email;
    private String motDePasse;
    private CompteUtilisateur.TypeCompte typeCompte;
    private String entityDocumentId;
    private CompteUtilisateur.TypeCompte entityType;
}