package com.example.back_gestion_Stage.Controllers;

import com.example.back_gestion_Stage.DTOs.StageDTO;
import com.example.back_gestion_Stage.Entities.Stage;
import com.example.back_gestion_Stage.Services.StageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stages")
@CrossOrigin(origins = "*")
public class StageController {

    @Autowired
    private StageService stageService;

    @GetMapping
    public ResponseEntity<List<StageDTO>> getAllStages() {
        List<StageDTO> stages = stageService.findAll();
        return ResponseEntity.ok(stages);
    }

    @GetMapping("/with-relations")
    public ResponseEntity<List<StageDTO>> getAllStagesWithRelations() {
        List<StageDTO> stages = stageService.findAllWithRelations();
        return ResponseEntity.ok(stages);
    }

    @GetMapping("/{documentId}")
    public ResponseEntity<StageDTO> getStageByDocumentId(@PathVariable String documentId) {
        return stageService.findByDocumentId(documentId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<StageDTO> createStage(@RequestBody StageDTO stageDTO) {
        StageDTO savedStage = stageService.save(stageDTO);
        return ResponseEntity.ok(savedStage);
    }

    @PutMapping("/{documentId}")
    public ResponseEntity<StageDTO> updateStage(@PathVariable String documentId, @RequestBody StageDTO stageDTO) {
        if (!stageService.findByDocumentId(documentId).isPresent()) {
            return ResponseEntity.notFound().build();
        }

        stageDTO.setDocumentId(documentId);
        StageDTO updatedStage = stageService.save(stageDTO);
        return ResponseEntity.ok(updatedStage);
    }

    @DeleteMapping("/{documentId}")
    public ResponseEntity<Void> deleteStage(@PathVariable String documentId) {
        if (!stageService.findByDocumentId(documentId).isPresent()) {
            return ResponseEntity.notFound().build();
        }

        stageService.deleteByDocumentId(documentId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/encadreur/{encadreurDocumentId}")
    public ResponseEntity<List<StageDTO>> getStagesByEncadreur(@PathVariable String encadreurDocumentId) {
        List<StageDTO> stages = stageService.findByEncadreur(encadreurDocumentId);
        return ResponseEntity.ok(stages);
    }

    @GetMapping("/superieur/{superieurDocumentId}")
    public ResponseEntity<List<StageDTO>> getStagesBySuperieur(@PathVariable String superieurDocumentId) {
        List<StageDTO> stages = stageService.findBySuperieurHierarchique(superieurDocumentId);
        return ResponseEntity.ok(stages);
    }

    @GetMapping("/statut/{statut}")
    public ResponseEntity<List<StageDTO>> getStagesByStatut(@PathVariable Stage.StatutStage statut) {
        List<StageDTO> stages = stageService.findByStatut(statut);
        return ResponseEntity.ok(stages);
    }

    @GetMapping("/stagiaire/{stagiaireDocumentId}")
    public ResponseEntity<List<StageDTO>> getStagesByStagiaire(@PathVariable String stagiaireDocumentId) {
        List<StageDTO> stages = stageService.findByStagiaire(stagiaireDocumentId);
        return ResponseEntity.ok(stages);
    }

    @PostMapping("/{stageDocumentId}/stagiaires/{stagiaireDocumentId}")
    public ResponseEntity<StageDTO> addStagiaireToStage(
            @PathVariable String stageDocumentId,
            @PathVariable String stagiaireDocumentId) {
        try {
            StageDTO updatedStage = stageService.addStagiaireToStage(stageDocumentId, stagiaireDocumentId);
            return ResponseEntity.ok(updatedStage);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @DeleteMapping("/{stageDocumentId}/stagiaires/{stagiaireDocumentId}")
    public ResponseEntity<StageDTO> removeStagiaireFromStage(
            @PathVariable String stageDocumentId,
            @PathVariable String stagiaireDocumentId) {
        try {
            StageDTO updatedStage = stageService.removeStagiaireFromStage(stageDocumentId, stagiaireDocumentId);
            return ResponseEntity.ok(updatedStage);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // CORRECTION: Mettre à jour cette méthode pour utiliser statutStage
    @PutMapping("/{documentId}/statut/{statut}")
    public ResponseEntity<StageDTO> updateStageStatut(
            @PathVariable String documentId,
            @PathVariable Stage.StatutStage statut) {
        return stageService.findByDocumentId(documentId)
                .map(stage -> {
                    stage.setStatutStage(statut); // CHANGEMENT: setStatutStage()
                    StageDTO updatedStage = stageService.save(stage);
                    return ResponseEntity.ok(updatedStage);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}