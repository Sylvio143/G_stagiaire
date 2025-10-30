package com.example.back_gestion_Stage.Services;

import com.example.back_gestion_Stage.Entities.Tache;
import com.example.back_gestion_Stage.Entities.Stage;
import com.example.back_gestion_Stage.DTOs.TacheDTO;
import com.example.back_gestion_Stage.Repositories.TacheRepository;
import com.example.back_gestion_Stage.Repositories.StageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class TacheService extends BaseService<Tache, TacheDTO> {

    @Autowired
    private TacheRepository tacheRepository;

    @Autowired
    private StageRepository stageRepository;

    @Override
    protected TacheRepository getRepository() {
        return tacheRepository;
    }

    @Override
    protected TacheDTO convertToDto(Tache entity) {
        TacheDTO dto = new TacheDTO();
        dto.setId(entity.getId());
        dto.setDocumentId(entity.getDocumentId());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        dto.setTitre(entity.getTitre());
        dto.setDescription(entity.getDescription());
        dto.setDateDebut(entity.getDateDebut());
        dto.setDateFin(entity.getDateFin());
        dto.setStatut(entity.getStatut());
        dto.setPriorite(entity.getPriorite());
        dto.setPrioriteLabel(entity.getPrioriteLabel());
        dto.setEnRetard(entity.isEnRetard());
        
        if (entity.getStage() != null) {
            dto.setStageDocumentId(entity.getStage().getDocumentId());
        }
        
        return dto;
    }

    @Override
    protected Tache convertToEntity(TacheDTO dto) {
        Tache entity = new Tache();
        entity.setId(dto.getId());
        entity.setDocumentId(dto.getDocumentId());
        entity.setTitre(dto.getTitre());
        entity.setDescription(dto.getDescription());
        entity.setDateDebut(dto.getDateDebut());
        entity.setDateFin(dto.getDateFin());
        entity.setStatut(dto.getStatut());
        entity.setPriorite(dto.getPriorite());
        
        if (dto.getStageDocumentId() != null) {
            stageRepository.findByDocumentId(dto.getStageDocumentId())
                .ifPresent(entity::setStage);
        }
        
        return entity;
    }

    // NOUVELLE MÉTHODE POUR LA MISE À JOUR
    @Override
    protected void updateEntityFromDto(Tache entity, TacheDTO dto) {
        if (dto.getTitre() != null) entity.setTitre(dto.getTitre());
        if (dto.getDescription() != null) entity.setDescription(dto.getDescription());
        if (dto.getDateDebut() != null) entity.setDateDebut(dto.getDateDebut());
        if (dto.getDateFin() != null) entity.setDateFin(dto.getDateFin());
        if (dto.getStatut() != null) entity.setStatut(dto.getStatut());
        if (dto.getPriorite() != null) entity.setPriorite(dto.getPriorite());
        // Ne pas mettre à jour : id, documentId, createdAt, updatedAt, stage
    }
    // Méthode pour créer une tâche avec relations
    @Transactional
    public TacheDTO createTacheWithRelations(TacheDTO tacheDTO) {
        Tache tache = convertToEntity(tacheDTO);
        Tache savedTache = tacheRepository.save(tache);
        return convertToDto(savedTache);
    }

    // Surcharger la méthode save
    @Override
    @Transactional
    public TacheDTO save(TacheDTO dto) {
        return createTacheWithRelations(dto);
    }

    @Override
    public Optional<TacheDTO> findByDocumentId(String documentId) {
        return tacheRepository.findByDocumentId(documentId)
                .map(this::convertToDto);
    }

    public List<TacheDTO> findByStage(String stageDocumentId) {
        return tacheRepository.findByStageDocumentId(stageDocumentId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<TacheDTO> findByStatut(Tache.StatutTache statut) {
        return tacheRepository.findByStatut(statut)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<TacheDTO> findTachesEnRetard() {
        return tacheRepository.findByDateFinBeforeAndStatutNot(LocalDateTime.now(), Tache.StatutTache.TERMINEE)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<TacheDTO> findByStageAndStatutOrderByPriorite(String stageDocumentId, Tache.StatutTache statut) {
        return tacheRepository.findByStageDocumentIdAndStatutOrderByPriorite(stageDocumentId, statut)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public TacheDTO updateStatut(String documentId, Tache.StatutTache nouveauStatut) {
        Optional<Tache> tacheOpt = tacheRepository.findByDocumentId(documentId);
        if (tacheOpt.isPresent()) {
            Tache tache = tacheOpt.get();
            tache.setStatut(nouveauStatut);
            Tache savedTache = tacheRepository.save(tache);
            return convertToDto(savedTache);
        }
        throw new RuntimeException("Tâche non trouvée");
    }

    @Override
    public void deleteByDocumentId(String documentId) {
        tacheRepository.findByDocumentId(documentId)
                .ifPresent(tache -> tacheRepository.deleteById(tache.getId()));
    }
}