package com.example.back_gestion_Stage.Controllers;

import com.example.back_gestion_Stage.DTOs.StagiaireDTO;
import com.example.back_gestion_Stage.Entities.StatutEntite;
import com.example.back_gestion_Stage.Services.StagiaireService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stagiaires")
@CrossOrigin(origins = "*")
public class StagiaireController {

    @Autowired
    private StagiaireService stagiaireService;

    @GetMapping
    public ResponseEntity<List<StagiaireDTO>> getAllStagiaires() {
        List<StagiaireDTO> stagiaires = stagiaireService.findAllActifs();
        return ResponseEntity.ok(stagiaires);
    }

    @GetMapping("/tous")
    public ResponseEntity<List<StagiaireDTO>> getAllStagiairesWithInactifs() {
        List<StagiaireDTO> stagiaires = stagiaireService.findAll();
        return ResponseEntity.ok(stagiaires);
    }

    @GetMapping("/with-encadreur")
    public ResponseEntity<List<StagiaireDTO>> getAllStagiairesWithEncadreur() {
        List<StagiaireDTO> stagiaires = stagiaireService.findAllWithEncadreur();
        return ResponseEntity.ok(stagiaires);
    }

    @GetMapping("/{documentId}")
    public ResponseEntity<StagiaireDTO> getStagiaireByDocumentId(@PathVariable String documentId) {
        return stagiaireService.findByDocumentId(documentId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<StagiaireDTO> getStagiaireByEmail(@PathVariable String email) {
        return stagiaireService.findByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<StagiaireDTO> createStagiaire(@RequestBody StagiaireDTO stagiaireDTO) {
        // Vérifications
        if (stagiaireService.existsByEmail(stagiaireDTO.getEmail())) {
            return ResponseEntity.badRequest().body(null);
        }
        if (stagiaireService.existsByCin(stagiaireDTO.getCin())) {
            return ResponseEntity.badRequest().body(null);
        }

        // S'assurer que le statut est ACTIF par défaut
        stagiaireDTO.setStatut(StatutEntite.ACTIF);
        StagiaireDTO savedStagiaire = stagiaireService.save(stagiaireDTO);
        return ResponseEntity.ok(savedStagiaire);
    }

    @PutMapping("/{documentId}")
    public ResponseEntity<StagiaireDTO> updateStagiaire(@PathVariable String documentId, @RequestBody StagiaireDTO stagiaireDTO) {
        if (!stagiaireService.findByDocumentId(documentId).isPresent()) {
            return ResponseEntity.notFound().build();
        }

        stagiaireDTO.setDocumentId(documentId);
        StagiaireDTO updatedStagiaire = stagiaireService.save(stagiaireDTO);
        return ResponseEntity.ok(updatedStagiaire);
    }

    @DeleteMapping("/{documentId}")
    public ResponseEntity<Void> deleteStagiaire(@PathVariable String documentId) {
        if (!stagiaireService.findByDocumentId(documentId).isPresent()) {
            return ResponseEntity.notFound().build();
        }

        stagiaireService.deleteByDocumentId(documentId);
        return ResponseEntity.ok().build();
    }

    // NOUVEAUX ENDPOINTS POUR LA GESTION DU STATUT
    @PutMapping("/{documentId}/desactiver")
    public ResponseEntity<StagiaireDTO> desactiverStagiaire(@PathVariable String documentId) {
        StagiaireDTO stagiaire = stagiaireService.desactiver(documentId);
        return stagiaire != null ? ResponseEntity.ok(stagiaire) : ResponseEntity.notFound().build();
    }

    @PutMapping("/{documentId}/activer")
    public ResponseEntity<StagiaireDTO> activerStagiaire(@PathVariable String documentId) {
        StagiaireDTO stagiaire = stagiaireService.activer(documentId);
        return stagiaire != null ? ResponseEntity.ok(stagiaire) : ResponseEntity.notFound().build();
    }

    @GetMapping("/inactifs")
    public ResponseEntity<List<StagiaireDTO>> getStagiairesInactifs() {
        List<StagiaireDTO> stagiaires = stagiaireService.findByStatut(StatutEntite.INACTIF);
        return ResponseEntity.ok(stagiaires);
    }

    @GetMapping("/statut/{statut}")
    public ResponseEntity<List<StagiaireDTO>> getStagiairesByStatut(@PathVariable StatutEntite statut) {
        List<StagiaireDTO> stagiaires = stagiaireService.findByStatut(statut);
        return ResponseEntity.ok(stagiaires);
    }

    // ENDPOINTS EXISTANTS
    @GetMapping("/encadreur/{encadreurDocumentId}")
    public ResponseEntity<List<StagiaireDTO>> getStagiairesByEncadreur(@PathVariable String encadreurDocumentId) {
        List<StagiaireDTO> stagiaires = stagiaireService.findByEncadreur(encadreurDocumentId);
        return ResponseEntity.ok(stagiaires);
    }

    @GetMapping("/ecole/{ecole}")
    public ResponseEntity<List<StagiaireDTO>> getStagiairesByEcole(@PathVariable String ecole) {
        List<StagiaireDTO> stagiaires = stagiaireService.findByEcole(ecole);
        return ResponseEntity.ok(stagiaires);
    }

    @GetMapping("/filiere/{filiere}")
    public ResponseEntity<List<StagiaireDTO>> getStagiairesByFiliere(@PathVariable String filiere) {
        List<StagiaireDTO> stagiaires = stagiaireService.findByFiliere(filiere);
        return ResponseEntity.ok(stagiaires);
    }

    @GetMapping("/check-email/{email}")
    public ResponseEntity<Boolean> checkEmailExists(@PathVariable String email) {
        boolean exists = stagiaireService.existsByEmail(email);
        return ResponseEntity.ok(exists);
    }

    @GetMapping("/check-cin/{cin}")
    public ResponseEntity<Boolean> checkCinExists(@PathVariable String cin) {
        boolean exists = stagiaireService.existsByCin(cin);
        return ResponseEntity.ok(exists);
    }

    @GetMapping("/{documentId}/has-active-stage")
    public ResponseEntity<Boolean> hasActiveStage(@PathVariable String documentId) {
        return stagiaireService.findByDocumentId(documentId)
                .map(stagiaire -> ResponseEntity.ok(stagiaire.getHasActiveStage()))
                .orElse(ResponseEntity.notFound().build());
    }
}