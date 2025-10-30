package com.example.back_gestion_Stage.Services;

import com.example.back_gestion_Stage.Entities.Stage;
import com.example.back_gestion_Stage.Entities.Stagiaire;
import com.example.back_gestion_Stage.Entities.Encadreur;
import com.example.back_gestion_Stage.Entities.SuperieurHierarchique;
import com.example.back_gestion_Stage.DTOs.StageDTO;
import com.example.back_gestion_Stage.Repositories.StageRepository;
import com.example.back_gestion_Stage.Repositories.StagiaireRepository;
import com.example.back_gestion_Stage.Repositories.EncadreurRepository;
import com.example.back_gestion_Stage.Repositories.SuperieurHierarchiqueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class StageService extends BaseService<Stage, StageDTO> {

    @Autowired
    private StageRepository stageRepository;

    @Autowired
    private StagiaireRepository stagiaireRepository;

    @Autowired
    private EncadreurRepository encadreurRepository;

    @Autowired
    private SuperieurHierarchiqueRepository superieurHierarchiqueRepository;

    @Override
    protected StageRepository getRepository() {
        return stageRepository;
    }

    @Override
    protected StageDTO convertToDto(Stage entity) {
        StageDTO dto = new StageDTO();
        dto.setId(entity.getId());
        dto.setDocumentId(entity.getDocumentId());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        dto.setTitre(entity.getTitre());
        dto.setDescription(entity.getDescription());
        dto.setDateDebut(entity.getDateDebut());
        dto.setDateFin(entity.getDateFin());
        dto.setStatutStage(entity.getStatutStage());
        
        if (entity.getEncadreur() != null) {
            dto.setEncadreurDocumentId(entity.getEncadreur().getDocumentId());
        }
        
        if (entity.getSuperieurHierarchique() != null) {
            dto.setSuperieurHierarchiqueDocumentId(entity.getSuperieurHierarchique().getDocumentId());
        }
        
        if (entity.getStagiaires() != null) {
            dto.setStagiairesDocumentIds(
                entity.getStagiaires().stream()
                    .map(Stagiaire::getDocumentId)
                    .collect(Collectors.toList())
            );
        }
        
        return dto;
    }

    @Override
    protected Stage convertToEntity(StageDTO dto) {
        Stage entity = new Stage();
        entity.setId(dto.getId());
        entity.setDocumentId(dto.getDocumentId());
        entity.setTitre(dto.getTitre());
        entity.setDescription(dto.getDescription());
        entity.setDateDebut(dto.getDateDebut());
        entity.setDateFin(dto.getDateFin());
        entity.setStatutStage(dto.getStatutStage());
        
        if (dto.getEncadreurDocumentId() != null) {
            encadreurRepository.findByDocumentId(dto.getEncadreurDocumentId())
                .ifPresent(entity::setEncadreur);
        }
        
        if (dto.getSuperieurHierarchiqueDocumentId() != null) {
            superieurHierarchiqueRepository.findByDocumentId(dto.getSuperieurHierarchiqueDocumentId())
                .ifPresent(entity::setSuperieurHierarchique);
        }
        
        if (dto.getStagiairesDocumentIds() != null) {
            List<Stagiaire> stagiaires = dto.getStagiairesDocumentIds().stream()
                .map(stagiaireDocId -> stagiaireRepository.findByDocumentId(stagiaireDocId).orElse(null))
                .filter(stagiaire -> stagiaire != null)
                .collect(Collectors.toList());
            entity.setStagiaires(stagiaires);
        }
        
        return entity;
    }

    // NOUVELLE MÉTHODE POUR LA MISE À JOUR
    @Override
    protected void updateEntityFromDto(Stage entity, StageDTO dto) {
        if (dto.getTitre() != null) entity.setTitre(dto.getTitre());
        if (dto.getDescription() != null) entity.setDescription(dto.getDescription());
        if (dto.getDateDebut() != null) entity.setDateDebut(dto.getDateDebut());
        if (dto.getDateFin() != null) entity.setDateFin(dto.getDateFin());
        if (dto.getStatutStage() != null) entity.setStatutStage(dto.getStatutStage());
        // Ne pas mettre à jour : id, documentId, createdAt, updatedAt, encadreur, superieurHierarchique, stagiaires
        // Les relations doivent être gérées via des méthodes spécifiques
    }

    // Les autres méthodes restent inchangées mais utilisent maintenant statutStage
    public List<StageDTO> findByEncadreur(String encadreurDocumentId) {
        return stageRepository.findByEncadreurDocumentId(encadreurDocumentId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<StageDTO> findBySuperieurHierarchique(String superieurDocumentId) {
        return stageRepository.findBySuperieurHierarchiqueDocumentId(superieurDocumentId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<StageDTO> findByStatut(Stage.StatutStage statut) {
        return stageRepository.findByStatutStage(statut)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<StageDTO> findByStagiaire(String stagiaireDocumentId) {
        return stageRepository.findByStagiaireDocumentId(stagiaireDocumentId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<StageDTO> findAllWithRelations() {
        return stageRepository.findAllWithRelations()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public StageDTO addStagiaireToStage(String stageDocumentId, String stagiaireDocumentId) {
        Optional<Stage> stageOpt = stageRepository.findByDocumentId(stageDocumentId);
        Optional<Stagiaire> stagiaireOpt = stagiaireRepository.findByDocumentId(stagiaireDocumentId);
        
        if (stageOpt.isPresent() && stagiaireOpt.isPresent()) {
            Stage stage = stageOpt.get();
            Stagiaire stagiaire = stagiaireOpt.get();
            
            stage.addStagiaire(stagiaire);
            Stage savedStage = stageRepository.save(stage);
            
            return convertToDto(savedStage);
        }
        
        throw new RuntimeException("Stage ou Stagiaire non trouvé");
    }

    @Transactional
    public StageDTO removeStagiaireFromStage(String stageDocumentId, String stagiaireDocumentId) {
        Optional<Stage> stageOpt = stageRepository.findByDocumentId(stageDocumentId);
        Optional<Stagiaire> stagiaireOpt = stagiaireRepository.findByDocumentId(stagiaireDocumentId);
        
        if (stageOpt.isPresent() && stagiaireOpt.isPresent()) {
            Stage stage = stageOpt.get();
            Stagiaire stagiaire = stagiaireOpt.get();
            
            stage.removeStagiaire(stagiaire);
            Stage savedStage = stageRepository.save(stage);
            
            return convertToDto(savedStage);
        }
        
        throw new RuntimeException("Stage ou Stagiaire non trouvé");
    }

    @Override
    public void deleteByDocumentId(String documentId) {
        stageRepository.findByDocumentId(documentId)
                .ifPresent(stage -> stageRepository.deleteById(stage.getId()));
    }
}