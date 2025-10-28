// TacheRepository.java
package com.example.back_gestion_Stage.Repositories;

import com.example.back_gestion_Stage.Entities.Tache;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TacheRepository extends JpaRepository<Tache, Long> {
    Optional<Tache> findByDocumentId(String documentId);
    List<Tache> findByStageDocumentId(String stageDocumentId);
    List<Tache> findByStatut(Tache.StatutTache statut);
    List<Tache> findByDateFinBeforeAndStatutNot(LocalDateTime date, Tache.StatutTache statut);
    
    @Query("SELECT t FROM Tache t WHERE t.stage.documentId = :stageDocumentId AND t.statut = :statut ORDER BY t.priorite ASC, t.dateFin ASC")
    List<Tache> findByStageDocumentIdAndStatutOrderByPriorite(String stageDocumentId, Tache.StatutTache statut);
    @Query("SELECT t FROM Tache t LEFT JOIN FETCH t.stage WHERE t.stage.documentId = :stageDocumentId")
List<Tache> findByStageDocumentId(String stageDocumentId);
}