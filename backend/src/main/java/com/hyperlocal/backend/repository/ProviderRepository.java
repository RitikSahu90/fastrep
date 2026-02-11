package com.hyperlocal.backend.repository;

import com.hyperlocal.backend.model.Provider;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProviderRepository extends JpaRepository<Provider, Long> {
    List<Provider> findByServiceTypeAndArea(String serviceType, String area);
}
