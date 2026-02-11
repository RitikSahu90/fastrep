package com.hyperlocal.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User user;

    @ManyToOne
    private Provider provider;

    @Column(length = 1000)
    private String message;

    private String status = "PENDING";

    private LocalDateTime createdAt = LocalDateTime.now();
}
