package com.example.back_gestion_Stage.Services;

import com.example.back_gestion_Stage.Entities.BaseEntity;
import com.example.back_gestion_Stage.DTOs.BaseDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

public abstract class BaseService<T extends BaseEntity, D extends BaseDTO> {
    
    protected abstract JpaRepository<T, Long> getRepository();
    protected abstract D convertToDto(T entity);
    protected abstract T convertToEntity(D dto);
    
    // NOUVELLE MÉTHODE ABSTRAITE POUR LA MISE À JOUR
    protected abstract void updateEntityFromDto(T entity, D dto);
    
    public List<D> findAll() {
        return getRepository().findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public Optional<D> findById(Long id) {
        return getRepository().findById(id)
                .map(this::convertToDto);
    }
    
    public Optional<D> findByDocumentId(String documentId) {
        return getRepository().findAll().stream()
                .filter(entity -> entity.getDocumentId().equals(documentId))
                .findFirst()
                .map(this::convertToDto);
    }
    
    // MÉTHODE SAVE CORRIGÉE
    public D save(D dto) {
        T entity;
        
        if (dto.getId() != null) {
            // MODIFICATION - Charger l'entité existante
            Optional<T> existingEntity = getRepository().findById(dto.getId());
            if (existingEntity.isPresent()) {
                entity = existingEntity.get();
                // Mettre à jour les champs avec la nouvelle méthode
                updateEntityFromDto(entity, dto);
            } else {
                // Création si l'ID n'existe pas dans la base
                entity = convertToEntity(dto);
            }
        } else {
            // CRÉATION - Nouvelle entité
            entity = convertToEntity(dto);
        }
        
        T savedEntity = getRepository().save(entity);
        return convertToDto(savedEntity);
    }
    
    public void deleteById(Long id) {
        getRepository().deleteById(id);
    }
    
    public void deleteByDocumentId(String documentId) {
        // Cette méthode doit être implémentée dans chaque service spécifique
    }
}