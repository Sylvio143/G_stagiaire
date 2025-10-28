package com.example.back_gestion_Stage.DTOs;

import lombok.Data;
import lombok.EqualsAndHashCode;
import com.example.back_gestion_Stage.Entities.Tache;
import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
public class TacheDTO extends BaseDTO {
    private String titre;
    private String description;
    private LocalDateTime dateDebut;
    private LocalDateTime dateFin;
    private Tache.StatutTache statut;
    private Integer priorite;
    private String stageDocumentId;
    private String prioriteLabel;
    private Boolean enRetard;
}