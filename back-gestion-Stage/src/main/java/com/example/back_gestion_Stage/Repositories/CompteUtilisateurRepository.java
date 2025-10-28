// CompteUtilisateurRepository.java
package com.example.back_gestion_Stage.Repositories;

import com.example.back_gestion_Stage.Entities.CompteUtilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CompteUtilisateurRepository extends JpaRepository<CompteUtilisateur, Long> {
    Optional<CompteUtilisateur> findByDocumentId(String documentId);
    Optional<CompteUtilisateur> findByEmail(String email);
    List<CompteUtilisateur> findByTypeCompte(CompteUtilisateur.TypeCompte typeCompte);
    List<CompteUtilisateur> findByEntityDocumentId(String entityDocumentId);
    boolean existsByEmail(String email);
    List<CompteUtilisateur> findByEntityDocumentIdAndEntityType(String entityDocumentId, CompteUtilisateur.TypeCompte entityType);
}