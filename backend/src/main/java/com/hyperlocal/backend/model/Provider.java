package com.hyperlocal.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "providers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Provider {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(optional = true)
    @JoinColumn(name = "user_id", nullable = true)
    private User user;

    private String serviceType;
    private String area;
    private String experience;
    private String priceRange;

    @Column(length = 1000)
    private String description;

    private String phone;
}
