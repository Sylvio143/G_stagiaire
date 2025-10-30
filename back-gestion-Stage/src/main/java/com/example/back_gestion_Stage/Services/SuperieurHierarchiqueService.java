package com.example.back_gestion_Stage.Services;

import com.example.back_gestion_Stage.Entities.SuperieurHierarchique;
import com.example.back_gestion_Stage.Entities.CompteUtilisateur;
import com.example.back_gestion_Stage.DTOs.SuperieurHierarchiqueDTO;
import com.example.back_gestion_Stage.Entities.StatutEntite;
import com.example.back_gestion_Stage.Repositories.SuperieurHierarchiqueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SuperieurHierarchiqueService extends BaseService<SuperieurHierarchique, SuperieurHierarchiqueDTO> {

    @Autowired
    private SuperieurHierarchiqueRepository superieurHierarchiqueRepository;

    @Autowired
    private CompteUtilisateurService compteUtilisateurService;

    @Override
    protected SuperieurHierarchiqueRepository getRepository() {
        return superieurHierarchiqueRepository;
    }

    @Override
    protected SuperieurHierarchiqueDTO convertToDto(SuperieurHierarchique entity) {
        SuperieurHierarchiqueDTO dto = new SuperieurHierarchiqueDTO();
        dto.setId(entity.getId());
        dto.setDocumentId(entity.getDocumentId());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        dto.setNom(entity.getNom());
        dto.setPrenom(entity.getPrenom());
        dto.setEmail(entity.getEmail());
        dto.setTelephone(entity.getTelephone());
        dto.setCin(entity.getCin());
        dto.setFonction(entity.getFonction());
        dto.setDepartement(entity.getDepartement());
        dto.setStatut(entity.getStatut());
        
        dto.setPhotoUrl(entity.getPhotoUrl());
        dto.setThumbnailUrl(entity.getThumbnailUrl());
        dto.setMediumPhotoUrl(entity.getMediumPhotoUrl());
        
        return dto;
    }

    @Override
    protected SuperieurHierarchique convertToEntity(SuperieurHierarchiqueDTO dto) {
        SuperieurHierarchique entity = new SuperieurHierarchique();
        entity.setId(dto.getId());
        entity.setDocumentId(dto.getDocumentId());
        entity.setNom(dto.getNom());
        entity.setPrenom(dto.getPrenom());
        entity.setEmail(dto.getEmail());
        entity.setTelephone(dto.getTelephone());
        entity.setCin(dto.getCin());
        entity.setFonction(dto.getFonction());
        entity.setDepartement(dto.getDepartement());
        entity.setStatut(dto.getStatut());
        
        return entity;
    }

    // NOUVELLE MÉTHODE POUR LA MISE À JOUR
    @Override
    protected void updateEntityFromDto(SuperieurHierarchique entity, SuperieurHierarchiqueDTO dto) {
        if (dto.getNom() != null) entity.setNom(dto.getNom());
        if (dto.getPrenom() != null) entity.setPrenom(dto.getPrenom());
        if (dto.getEmail() != null) entity.setEmail(dto.getEmail());
        if (dto.getTelephone() != null) entity.setTelephone(dto.getTelephone());
        if (dto.getCin() != null) entity.setCin(dto.getCin());
        if (dto.getFonction() != null) entity.setFonction(dto.getFonction());
        if (dto.getDepartement() != null) entity.setDepartement(dto.getDepartement());
        if (dto.getStatut() != null) entity.setStatut(dto.getStatut());
        // Ne pas mettre à jour : id, documentId, createdAt, updatedAt, photo
    }

    // Méthodes spécifiques avec filtrage par statut
    public List<SuperieurHierarchiqueDTO> findAllActifs() {
        return superieurHierarchiqueRepository.findAll().stream()
                .filter(superieur -> superieur.getStatut() == StatutEntite.ACTIF)
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Optional<SuperieurHierarchiqueDTO> findByEmail(String email) {
        return superieurHierarchiqueRepository.findByEmail(email)
                .filter(superieur -> superieur.getStatut() == StatutEntite.ACTIF)
                .map(this::convertToDto);
    }

    public boolean existsByEmailAndNotId(String email, String documentId) {
        return superieurHierarchiqueRepository.findByEmail(email)
                .map(superieur -> 
                    !superieur.getDocumentId().equals(documentId) && 
                    superieur.getStatut() == StatutEntite.ACTIF
                )
                .orElse(false);
    }
    
    public boolean existsByCinAndNotId(String cin, String documentId) {
        return superieurHierarchiqueRepository.findByCin(cin)
                .map(superieur -> 
                    !superieur.getDocumentId().equals(documentId) && 
                    superieur.getStatut() == StatutEntite.ACTIF
                )
                .orElse(false);
    }

     
    public boolean existsByEmail(String email) {
        return superieurHierarchiqueRepository.findByEmail(email)
                .map(superieur -> superieur.getStatut() == StatutEntite.ACTIF)
                .orElse(false);
    }

    public boolean existsByCin(String cin) {
        return superieurHierarchiqueRepository.findByCin(cin)
                .map(superieur -> superieur.getStatut() == StatutEntite.ACTIF)
                .orElse(false);
    }
    

    // Méthodes de gestion du statut
    public SuperieurHierarchiqueDTO desactiver(String documentId) {
        Optional<SuperieurHierarchique> superieurOpt = superieurHierarchiqueRepository.findByDocumentId(documentId);
        if (superieurOpt.isPresent()) {
            SuperieurHierarchique superieur = superieurOpt.get();
            superieur.setStatut(StatutEntite.INACTIF);
            SuperieurHierarchique savedSuperieur = superieurHierarchiqueRepository.save(superieur);
            
            // Désactiver le compte utilisateur associé
            compteUtilisateurService.findByEntity(superieur.getDocumentId(), 
                    CompteUtilisateur.TypeCompte.SUPERIEUR_HIERARCHIQUE)
                .ifPresent(compte -> {
                    compteUtilisateurService.desactiver(compte.getDocumentId());
                });
            
            return convertToDto(savedSuperieur);
        }
        return null;
    }

    public SuperieurHierarchiqueDTO activer(String documentId) {
        Optional<SuperieurHierarchique> superieurOpt = superieurHierarchiqueRepository.findByDocumentId(documentId);
        if (superieurOpt.isPresent()) {
            SuperieurHierarchique superieur = superieurOpt.get();
            superieur.setStatut(StatutEntite.ACTIF);
            SuperieurHierarchique savedSuperieur = superieurHierarchiqueRepository.save(superieur);
            
            // Activer le compte utilisateur associé
            compteUtilisateurService.findByEntity(superieur.getDocumentId(), 
                    CompteUtilisateur.TypeCompte.SUPERIEUR_HIERARCHIQUE)
                .ifPresent(compte -> {
                    compteUtilisateurService.activer(compte.getDocumentId());
                });
            
            return convertToDto(savedSuperieur);
        }
        return null;
    }

    public List<SuperieurHierarchiqueDTO> findByStatut(StatutEntite statut) {
        return superieurHierarchiqueRepository.findAll().stream()
                .filter(superieur -> superieur.getStatut() == statut)
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // Autres méthodes inchangées
    public List<SuperieurHierarchiqueDTO> findByDepartement(String departement) {
        return superieurHierarchiqueRepository.findByDepartement(departement)
                .stream()
                .filter(superieur -> superieur.getStatut() == StatutEntite.ACTIF)
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<SuperieurHierarchiqueDTO> findAllWithPhoto() {
        return superieurHierarchiqueRepository.findAllWithPhoto()
                .stream()
                .filter(superieur -> superieur.getStatut() == StatutEntite.ACTIF)
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteByDocumentId(String documentId) {
        superieurHierarchiqueRepository.findByDocumentId(documentId)
                .ifPresent(superieur -> superieurHierarchiqueRepository.deleteById(superieur.getId()));
    }

    public long countByDepartement(String departement) {
        return superieurHierarchiqueRepository.findByDepartement(departement)
                .stream()
                .filter(superieur -> superieur.getStatut() == StatutEntite.ACTIF)
                .count();
    }

    public long countTotal() {
        return superieurHierarchiqueRepository.findAll()
                .stream()
                .filter(superieur -> superieur.getStatut() == StatutEntite.ACTIF)
                .count();
    }
}