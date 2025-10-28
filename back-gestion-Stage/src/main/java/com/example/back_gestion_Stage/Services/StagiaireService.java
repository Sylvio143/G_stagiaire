package com.example.back_gestion_Stage.Services;

import com.example.back_gestion_Stage.Entities.Stagiaire;
import com.example.back_gestion_Stage.Entities.Encadreur;
import com.example.back_gestion_Stage.DTOs.StagiaireDTO;
import com.example.back_gestion_Stage.Repositories.StagiaireRepository;
import com.example.back_gestion_Stage.Repositories.EncadreurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class StagiaireService extends BaseService<Stagiaire, StagiaireDTO> {

    @Autowired
    private StagiaireRepository stagiaireRepository;

    @Autowired
    private EncadreurRepository encadreurRepository;

    @Override
    protected StagiaireRepository getRepository() {
        return stagiaireRepository;
    }

    @Override
    protected StagiaireDTO convertToDto(Stagiaire entity) {
        StagiaireDTO dto = new StagiaireDTO();
        dto.setId(entity.getId());
        dto.setDocumentId(entity.getDocumentId());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        dto.setNom(entity.getNom());
        dto.setPrenom(entity.getPrenom());
        dto.setEmail(entity.getEmail());
        dto.setTelephone(entity.getTelephone());
        dto.setCin(entity.getCin());
        dto.setEcole(entity.getEcole());
        dto.setFiliere(entity.getFiliere());
        dto.setNiveauEtude(entity.getNiveauEtude());
        dto.setDateNaissance(entity.getDateNaissance());
        dto.setAdresse(entity.getAdresse());
        
        // Charger la relation avec l'encadreur
        if (entity.getEncadreur() != null) {
            dto.setEncadreurDocumentId(entity.getEncadreur().getDocumentId());
        }
        
        dto.setPhotoUrl(entity.getPhotoUrl());
        dto.setThumbnailUrl(entity.getThumbnailUrl());
        dto.setMediumPhotoUrl(entity.getMediumPhotoUrl());
        dto.setHasActiveStage(entity.hasActiveStage());
        
        return dto;
    }

    @Override
    protected Stagiaire convertToEntity(StagiaireDTO dto) {
        Stagiaire entity = new Stagiaire();
        entity.setId(dto.getId());
        entity.setDocumentId(dto.getDocumentId());
        entity.setNom(dto.getNom());
        entity.setPrenom(dto.getPrenom());
        entity.setEmail(dto.getEmail());
        entity.setTelephone(dto.getTelephone());
        entity.setCin(dto.getCin());
        entity.setEcole(dto.getEcole());
        entity.setFiliere(dto.getFiliere());
        entity.setNiveauEtude(dto.getNiveauEtude());
        entity.setDateNaissance(dto.getDateNaissance());
        entity.setAdresse(dto.getAdresse());
        
        // Établir la relation avec l'encadreur
        if (dto.getEncadreurDocumentId() != null) {
            encadreurRepository.findByDocumentId(dto.getEncadreurDocumentId())
                .ifPresent(entity::setEncadreur);
        }
        
        return entity;
    }

    // Méthode pour créer un stagiaire avec relations
    @Transactional
    public StagiaireDTO createStagiaireWithRelations(StagiaireDTO stagiaireDTO) {
        Stagiaire stagiaire = convertToEntity(stagiaireDTO);
        Stagiaire savedStagiaire = stagiaireRepository.save(stagiaire);
        return convertToDto(savedStagiaire);
    }

    // Surcharger la méthode save
    @Override
    @Transactional
    public StagiaireDTO save(StagiaireDTO dto) {
        return createStagiaireWithRelations(dto);
    }

    @Override
    public Optional<StagiaireDTO> findByDocumentId(String documentId) {
        return stagiaireRepository.findByDocumentId(documentId)
                .map(this::convertToDto);
    }

    public Optional<StagiaireDTO> findByEmail(String email) {
        return stagiaireRepository.findByEmail(email)
                .map(this::convertToDto);
    }

    public List<StagiaireDTO> findByEncadreur(String encadreurDocumentId) {
        return stagiaireRepository.findByEncadreurDocumentId(encadreurDocumentId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<StagiaireDTO> findByEcole(String ecole) {
        return stagiaireRepository.findByEcole(ecole)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<StagiaireDTO> findByFiliere(String filiere) {
        return stagiaireRepository.findByFiliere(filiere)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<StagiaireDTO> findAllWithEncadreur() {
        return stagiaireRepository.findAllWithEncadreur()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public boolean existsByEmail(String email) {
        return stagiaireRepository.existsByEmail(email);
    }

    public boolean existsByCin(String cin) {
        return stagiaireRepository.existsByCin(cin);
    }

    @Override
    public void deleteByDocumentId(String documentId) {
        stagiaireRepository.findByDocumentId(documentId)
                .ifPresent(stagiaire -> stagiaireRepository.deleteById(stagiaire.getId()));
    }
}