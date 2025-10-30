package com.example.back_gestion_Stage.Services;

import com.example.back_gestion_Stage.Entities.Stagiaire;
import com.example.back_gestion_Stage.Entities.Encadreur;
import com.example.back_gestion_Stage.Entities.CompteUtilisateur;
import com.example.back_gestion_Stage.DTOs.StagiaireDTO;
import com.example.back_gestion_Stage.Entities.StatutEntite;
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

    @Autowired
    private CompteUtilisateurService compteUtilisateurService;

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
        dto.setStatut(entity.getStatut());
        
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
        entity.setStatut(dto.getStatut());
        
        if (dto.getEncadreurDocumentId() != null) {
            encadreurRepository.findByDocumentId(dto.getEncadreurDocumentId())
                .ifPresent(entity::setEncadreur);
        }
        
        return entity;
    }

    // NOUVELLE MÉTHODE POUR LA MISE À JOUR
    @Override
    protected void updateEntityFromDto(Stagiaire entity, StagiaireDTO dto) {
        if (dto.getNom() != null) entity.setNom(dto.getNom());
        if (dto.getPrenom() != null) entity.setPrenom(dto.getPrenom());
        if (dto.getEmail() != null) entity.setEmail(dto.getEmail());
        if (dto.getTelephone() != null) entity.setTelephone(dto.getTelephone());
        if (dto.getCin() != null) entity.setCin(dto.getCin());
        if (dto.getEcole() != null) entity.setEcole(dto.getEcole());
        if (dto.getFiliere() != null) entity.setFiliere(dto.getFiliere());
        if (dto.getNiveauEtude() != null) entity.setNiveauEtude(dto.getNiveauEtude());
        if (dto.getDateNaissance() != null) entity.setDateNaissance(dto.getDateNaissance());
        if (dto.getAdresse() != null) entity.setAdresse(dto.getAdresse());
        if (dto.getStatut() != null) entity.setStatut(dto.getStatut());
        // Ne pas mettre à jour : id, documentId, createdAt, updatedAt, photo, encadreur
    }

    // Méthodes spécifiques avec filtrage par statut
    public List<StagiaireDTO> findAllActifs() {
        return stagiaireRepository.findAll().stream()
                .filter(stagiaire -> stagiaire.getStatut() == StatutEntite.ACTIF)
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Optional<StagiaireDTO> findByEmail(String email) {
        return stagiaireRepository.findByEmail(email)
                .filter(stagiaire -> stagiaire.getStatut() == StatutEntite.ACTIF)
                .map(this::convertToDto);
    }

    public List<StagiaireDTO> findByEncadreur(String encadreurDocumentId) {
        return stagiaireRepository.findByEncadreurDocumentId(encadreurDocumentId)
                .stream()
                .filter(stagiaire -> stagiaire.getStatut() == StatutEntite.ACTIF)
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public boolean existsByEmail(String email) {
        return stagiaireRepository.findByEmail(email)
                .map(stagiaire -> stagiaire.getStatut() == StatutEntite.ACTIF)
                .orElse(false);
    }

    public boolean existsByCin(String cin) {
        return stagiaireRepository.findByCin(cin)
                .map(stagiaire -> stagiaire.getStatut() == StatutEntite.ACTIF)
                .orElse(false);
    }

    // Méthodes de gestion du statut
    public StagiaireDTO desactiver(String documentId) {
        Optional<Stagiaire> stagiaireOpt = stagiaireRepository.findByDocumentId(documentId);
        if (stagiaireOpt.isPresent()) {
            Stagiaire stagiaire = stagiaireOpt.get();
            stagiaire.setStatut(StatutEntite.INACTIF);
            Stagiaire savedStagiaire = stagiaireRepository.save(stagiaire);
            
            // Désactiver le compte utilisateur associé
            compteUtilisateurService.findByEntity(stagiaire.getDocumentId(), 
                    CompteUtilisateur.TypeCompte.STAGIAIRE)
                .ifPresent(compte -> {
                    compteUtilisateurService.desactiver(compte.getDocumentId());
                });
            
            return convertToDto(savedStagiaire);
        }
        return null;
    }

    public StagiaireDTO activer(String documentId) {
        Optional<Stagiaire> stagiaireOpt = stagiaireRepository.findByDocumentId(documentId);
        if (stagiaireOpt.isPresent()) {
            Stagiaire stagiaire = stagiaireOpt.get();
            stagiaire.setStatut(StatutEntite.ACTIF);
            Stagiaire savedStagiaire = stagiaireRepository.save(stagiaire);
            
            // Activer le compte utilisateur associé
            compteUtilisateurService.findByEntity(stagiaire.getDocumentId(), 
                    CompteUtilisateur.TypeCompte.STAGIAIRE)
                .ifPresent(compte -> {
                    compteUtilisateurService.activer(compte.getDocumentId());
                });
            
            return convertToDto(savedStagiaire);
        }
        return null;
    }

    public List<StagiaireDTO> findByStatut(StatutEntite statut) {
        return stagiaireRepository.findAll().stream()
                .filter(stagiaire -> stagiaire.getStatut() == statut)
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // Autres méthodes inchangées
    public List<StagiaireDTO> findByEcole(String ecole) {
        return stagiaireRepository.findByEcole(ecole)
                .stream()
                .filter(stagiaire -> stagiaire.getStatut() == StatutEntite.ACTIF)
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<StagiaireDTO> findByFiliere(String filiere) {
        return stagiaireRepository.findByFiliere(filiere)
                .stream()
                .filter(stagiaire -> stagiaire.getStatut() == StatutEntite.ACTIF)
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<StagiaireDTO> findAllWithEncadreur() {
        return stagiaireRepository.findAllWithEncadreur()
                .stream()
                .filter(stagiaire -> stagiaire.getStatut() == StatutEntite.ACTIF)
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteByDocumentId(String documentId) {
        stagiaireRepository.findByDocumentId(documentId)
                .ifPresent(stagiaire -> stagiaireRepository.deleteById(stagiaire.getId()));
    }
}