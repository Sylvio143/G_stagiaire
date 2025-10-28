package com.example.back_gestion_Stage.DTOs;

import lombok.Data;
import lombok.EqualsAndHashCode;
import com.example.back_gestion_Stage.Entities.Stage;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
public class StageDTO extends BaseDTO {
    private String titre;
    private String description;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private Stage.StatutStage statut;
    private String encadreurDocumentId;
    private String superieurHierarchiqueDocumentId;
    private List<String> stagiairesDocumentIds = new ArrayList<>();
    private List<TacheDTO> taches = new ArrayList<>();
}