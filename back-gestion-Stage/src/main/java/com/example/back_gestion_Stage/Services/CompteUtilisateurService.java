package com.example.back_gestion_Stage.Services;

import com.example.back_gestion_Stage.Entities.CompteUtilisateur;
import com.example.back_gestion_Stage.DTOs.CompteUtilisateurDTO;
import com.example.back_gestion_Stage.Repositories.CompteUtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CompteUtilisateurService extends BaseService<CompteUtilisateur, CompteUtilisateurDTO> {

    @Autowired
    private CompteUtilisateurRepository compteUtilisateurRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    protected CompteUtilisateurRepository getRepository() {
        return compteUtilisateurRepository;
    }

    @Override
    protected CompteUtilisateurDTO convertToDto(CompteUtilisateur entity) {
        CompteUtilisateurDTO dto = new CompteUtilisateurDTO();
        dto.setId(entity.getId());
        dto.setDocumentId(entity.getDocumentId());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        dto.setEmail(entity.getEmail());
        // Ne pas exposer le mot de passe dans le DTO pour des raisons de sécurité
        // dto.setMotDePasse(entity.getMotDePasse());
        dto.setTypeCompte(entity.getTypeCompte());
        dto.setEntityDocumentId(entity.getEntityDocumentId());
        dto.setEntityType(entity.getEntityType());
        return dto;
    }

    @Override
    protected CompteUtilisateur convertToEntity(CompteUtilisateurDTO dto) {
        CompteUtilisateur entity = new CompteUtilisateur();
        entity.setId(dto.getId());
        entity.setDocumentId(dto.getDocumentId());
        entity.setEmail(dto.getEmail());
        
        // Encoder le mot de passe s'il est fourni
        if (dto.getMotDePasse() != null && !dto.getMotDePasse().isEmpty()) {
            entity.setMotDePasse(passwordEncoder.encode(dto.getMotDePasse()));
        } else if (dto.getId() != null) {
            // Si c'est une mise à jour et que le mot de passe n'est pas fourni, conserver l'ancien
            compteUtilisateurRepository.findById(dto.getId())
                .ifPresent(existingCompte -> entity.setMotDePasse(existingCompte.getMotDePasse()));
        }
        
        entity.setTypeCompte(dto.getTypeCompte());
        entity.setEntityDocumentId(dto.getEntityDocumentId());
        entity.setEntityType(dto.getEntityType());
        return entity;
    }

    @Override
    public Optional<CompteUtilisateurDTO> findByDocumentId(String documentId) {
        return compteUtilisateurRepository.findByDocumentId(documentId)
                .map(this::convertToDto);
    }

    public Optional<CompteUtilisateurDTO> findByEmail(String email) {
        return compteUtilisateurRepository.findByEmail(email)
                .map(this::convertToDto);
    }

    public List<CompteUtilisateurDTO> findByTypeCompte(CompteUtilisateur.TypeCompte typeCompte) {
        return compteUtilisateurRepository.findByTypeCompte(typeCompte)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<CompteUtilisateurDTO> findByEntityDocumentId(String entityDocumentId) {
        return compteUtilisateurRepository.findByEntityDocumentId(entityDocumentId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public boolean existsByEmail(String email) {
        return compteUtilisateurRepository.existsByEmail(email);
    }

    public boolean verifyPassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

    // NOUVELLES MÉTHODES MANQUANTES
    public CompteUtilisateurDTO createCompteUtilisateur(CompteUtilisateurDTO compteDTO) {
        // Vérifier si l'email existe déjà
        if (existsByEmail(compteDTO.getEmail())) {
            throw new RuntimeException("Un compte avec cet email existe déjà");
        }
        
        // S'assurer que le mot de passe est fourni
        if (compteDTO.getMotDePasse() == null || compteDTO.getMotDePasse().isEmpty()) {
            throw new RuntimeException("Le mot de passe est obligatoire");
        }
        
        CompteUtilisateur entity = convertToEntity(compteDTO);
        CompteUtilisateur savedEntity = compteUtilisateurRepository.save(entity);
        return convertToDto(savedEntity);
    }

    public Optional<CompteUtilisateurDTO> authenticate(String email, String password) {
        Optional<CompteUtilisateur> compteOpt = compteUtilisateurRepository.findByEmail(email);
        
        if (compteOpt.isPresent()) {
            CompteUtilisateur compte = compteOpt.get();
            if (verifyPassword(password, compte.getMotDePasse())) {
                return Optional.of(convertToDto(compte));
            }
        }
        
        return Optional.empty();
    }

    public CompteUtilisateurDTO updatePassword(String documentId, String newPassword) {
        Optional<CompteUtilisateur> compteOpt = compteUtilisateurRepository.findByDocumentId(documentId);
        
        if (compteOpt.isPresent()) {
            CompteUtilisateur compte = compteOpt.get();
            compte.setMotDePasse(passwordEncoder.encode(newPassword));
            CompteUtilisateur savedCompte = compteUtilisateurRepository.save(compte);
            return convertToDto(savedCompte);
        }
        
        throw new RuntimeException("Compte utilisateur non trouvé");
    }

    @Override
    public void deleteByDocumentId(String documentId) {
        compteUtilisateurRepository.findByDocumentId(documentId)
                .ifPresent(compte -> compteUtilisateurRepository.deleteById(compte.getId()));
    }

    // Méthode utilitaire pour créer un compte automatiquement lors de la création d'un utilisateur
    public CompteUtilisateurDTO createCompteForEntity(String email, String password, 
                                                    CompteUtilisateur.TypeCompte typeCompte, 
                                                    String entityDocumentId) {
        CompteUtilisateurDTO compteDTO = new CompteUtilisateurDTO();
        compteDTO.setEmail(email);
        compteDTO.setMotDePasse(password);
        compteDTO.setTypeCompte(typeCompte);
        compteDTO.setEntityDocumentId(entityDocumentId);
        compteDTO.setEntityType(typeCompte); // Même type pour entityType
        
        return createCompteUtilisateur(compteDTO);
    }

    // Méthode pour récupérer le compte associé à une entité
    public Optional<CompteUtilisateurDTO> findByEntity(String entityDocumentId, CompteUtilisateur.TypeCompte entityType) {
        return compteUtilisateurRepository.findByEntityDocumentIdAndEntityType(entityDocumentId, entityType)
                .stream()
                .findFirst()
                .map(this::convertToDto);
    }
}