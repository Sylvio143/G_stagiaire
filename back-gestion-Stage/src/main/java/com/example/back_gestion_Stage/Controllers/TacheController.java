package com.example.back_gestion_Stage.Controllers;

import com.example.back_gestion_Stage.DTOs.TacheDTO;
import com.example.back_gestion_Stage.Entities.Tache;
import com.example.back_gestion_Stage.Services.TacheService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/taches")
@CrossOrigin(origins = "*")
public class TacheController {

    @Autowired
    private TacheService tacheService;

    @GetMapping
    public ResponseEntity<List<TacheDTO>> getAllTaches() {
        List<TacheDTO> taches = tacheService.findAll();
        return ResponseEntity.ok(taches);
    }

    @GetMapping("/{documentId}")
    public ResponseEntity<TacheDTO> getTacheByDocumentId(@PathVariable String documentId) {
        return tacheService.findByDocumentId(documentId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<TacheDTO> createTache(@RequestBody TacheDTO tacheDTO) {
        TacheDTO savedTache = tacheService.save(tacheDTO);
        return ResponseEntity.ok(savedTache);
    }

    @PutMapping("/{documentId}")
    public ResponseEntity<TacheDTO> updateTache(@PathVariable String documentId, @RequestBody TacheDTO tacheDTO) {
        if (!tacheService.findByDocumentId(documentId).isPresent()) {
            return ResponseEntity.notFound().build();
        }

        tacheDTO.setDocumentId(documentId);
        TacheDTO updatedTache = tacheService.save(tacheDTO);
        return ResponseEntity.ok(updatedTache);
    }

    @DeleteMapping("/{documentId}")
    public ResponseEntity<Void> deleteTache(@PathVariable String documentId) {
        if (!tacheService.findByDocumentId(documentId).isPresent()) {
            return ResponseEntity.notFound().build();
        }

        tacheService.deleteByDocumentId(documentId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/stage/{stageDocumentId}")
    public ResponseEntity<List<TacheDTO>> getTachesByStage(@PathVariable String stageDocumentId) {
        List<TacheDTO> taches = tacheService.findByStage(stageDocumentId);
        return ResponseEntity.ok(taches);
    }

    @GetMapping("/statut/{statut}")
    public ResponseEntity<List<TacheDTO>> getTachesByStatut(@PathVariable Tache.StatutTache statut) {
        List<TacheDTO> taches = tacheService.findByStatut(statut);
        return ResponseEntity.ok(taches);
    }

    @GetMapping("/en-retard")
    public ResponseEntity<List<TacheDTO>> getTachesEnRetard() {
        List<TacheDTO> taches = tacheService.findTachesEnRetard();
        return ResponseEntity.ok(taches);
    }

    @GetMapping("/stage/{stageDocumentId}/statut/{statut}")
    public ResponseEntity<List<TacheDTO>> getTachesByStageAndStatut(
            @PathVariable String stageDocumentId,
            @PathVariable Tache.StatutTache statut) {
        List<TacheDTO> taches = tacheService.findByStageAndStatutOrderByPriorite(stageDocumentId, statut);
        return ResponseEntity.ok(taches);
    }

    @PutMapping("/{documentId}/statut/{statut}")
    public ResponseEntity<TacheDTO> updateTacheStatut(
            @PathVariable String documentId,
            @PathVariable Tache.StatutTache statut) {
        try {
            TacheDTO updatedTache = tacheService.updateStatut(documentId, statut);
            return ResponseEntity.ok(updatedTache);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{documentId}/priorite/{priorite}")
    public ResponseEntity<TacheDTO> updateTachePriorite(
            @PathVariable String documentId,
            @PathVariable Integer priorite) {
        return tacheService.findByDocumentId(documentId)
                .map(tache -> {
                    tache.setPriorite(priorite);
                    TacheDTO updatedTache = tacheService.save(tache);
                    return ResponseEntity.ok(updatedTache);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}