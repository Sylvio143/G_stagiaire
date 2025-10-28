// StageRepository.java
package com.example.back_gestion_Stage.Repositories;

import com.example.back_gestion_Stage.Entities.Stage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface StageRepository extends JpaRepository<Stage, Long> {
    Optional<Stage> findByDocumentId(String documentId);
    List<Stage> findByEncadreurDocumentId(String encadreurDocumentId);
    List<Stage> findBySuperieurHierarchiqueDocumentId(String superieurDocumentId);
    List<Stage> findByStatut(Stage.StatutStage statut);
    List<Stage> findByDateDebutBetween(LocalDate start, LocalDate end);
    List<Stage> findByDateFinBetween(LocalDate start, LocalDate end);
    
    @Query("SELECT s FROM Stage s LEFT JOIN FETCH s.encadreur LEFT JOIN FETCH s.superieurHierarchique")
    List<Stage> findAllWithRelations();
    
    @Query("SELECT s FROM Stage s JOIN s.stagiaires st WHERE st.documentId = :stagiaireDocumentId")
    List<Stage> findByStagiaireDocumentId(String stagiaireDocumentId);

}