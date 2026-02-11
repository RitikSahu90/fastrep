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

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String serviceType;
    private String area;
    private String experience;
    private String priceRange;

    @Column(length = 1000)
    private String description;

    private String phone;
}
