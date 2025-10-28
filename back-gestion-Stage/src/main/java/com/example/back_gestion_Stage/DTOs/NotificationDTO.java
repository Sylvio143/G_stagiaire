package com.example.back_gestion_Stage.DTOs;

import com.example.back_gestion_Stage.Entities.Notification;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class NotificationDTO extends BaseDTO {
    private String titre;
    private String message;
    private Notification.TypeNotification type;
    private boolean lue = false;
    private String documentIdReference;
    private String typeReference;
    private String compteUtilisateurDocumentId;
}