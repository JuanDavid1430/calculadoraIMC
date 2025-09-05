-- SmithStrong - Sistema de Gestión de IMC
-- Base de datos MySQL
-- Fecha: Septiembre 2025

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS smithstrong_imc 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE smithstrong_imc;

-- ============================================================================
-- TABLA: Disability
-- Descripción: Almacena los tipos de discapacidades
-- ============================================================================
CREATE TABLE Disability (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL UNIQUE,
    Created_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================================
-- TABLA: Person
-- Descripción: Información personal de los usuarios
-- ============================================================================
CREATE TABLE Person (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(50) NOT NULL,
    Lastname VARCHAR(50) NOT NULL,
    Age INT NOT NULL CHECK (Age >= 13 AND Age <= 120),
    Gender ENUM('M', 'F') NOT NULL,
    Id_Disability INT NULL,
    Created_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Claves foráneas
    FOREIGN KEY (Id_Disability) REFERENCES Disability(Id) ON DELETE SET NULL ON UPDATE CASCADE,
    
    -- Índices
    INDEX idx_person_age (Age),
    INDEX idx_person_gender (Gender),
    INDEX idx_person_disability (Id_Disability)
);

-- ============================================================================
-- TABLA: User
-- Descripción: Credenciales y datos de autenticación de usuarios
-- ============================================================================
CREATE TABLE User (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Email VARCHAR(255) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    Id_Person INT NOT NULL,
    Image TEXT NULL,
    Is_Active BOOLEAN DEFAULT TRUE,
    Last_Login TIMESTAMP NULL,
    Created_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Claves foráneas
    FOREIGN KEY (Id_Person) REFERENCES Person(Id) ON DELETE CASCADE ON UPDATE CASCADE,
    
    -- Índices
    INDEX idx_user_email (Email),
    INDEX idx_user_active (Is_Active),
    INDEX idx_user_person (Id_Person)
);

-- ============================================================================
-- TABLA: Class
-- Descripción: Clasificaciones de IMC (A, B, C, etc.)
-- ============================================================================
CREATE TABLE Class (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Class_Letter VARCHAR(5) NOT NULL UNIQUE,
    Min DECIMAL(4,2) NOT NULL,
    Max DECIMAL(4,2) NOT NULL,
    Description VARCHAR(255) NULL,
    Created_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Validaciones
    CHECK (Min >= 0 AND Max > Min),
    
    -- Índices
    INDEX idx_class_range (Min, Max),
    INDEX idx_class_letter (Class_Letter)
);

-- ============================================================================
-- TABLA: History
-- Descripción: Historial de cálculos de IMC de cada usuario
-- ============================================================================
CREATE TABLE History (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Id_User INT NOT NULL,
    Weight DECIMAL(5,2) NOT NULL CHECK (Weight > 0 AND Weight <= 300),
    Height DECIMAL(5,2) NOT NULL CHECK (Height > 0 AND Height <= 250),
    IMC DECIMAL(5,2) NOT NULL CHECK (IMC > 0),
    Created_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Claves foráneas
    FOREIGN KEY (Id_User) REFERENCES User(Id) ON DELETE CASCADE ON UPDATE CASCADE,
    
    -- Índices
    INDEX idx_history_user (Id_User),
    INDEX idx_history_date (Created_Date),
    INDEX idx_history_imc (IMC),
    INDEX idx_history_user_date (Id_User, Created_Date)
);

-- ============================================================================
-- TABLA: Rutine
-- Descripción: Rutinas de ejercicio disponibles
-- ============================================================================
CREATE TABLE Rutine (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Description TEXT NOT NULL,
    Id_Class INT NOT NULL,
    Duration_Minutes INT DEFAULT 45 CHECK (Duration_Minutes > 0),
    Difficulty_Level ENUM('Beginner', 'Intermediate', 'Advanced') DEFAULT 'Beginner',
    Equipment_Required TEXT NULL,
    Is_Active BOOLEAN DEFAULT TRUE,
    Created_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Claves foráneas
    FOREIGN KEY (Id_Class) REFERENCES Class(Id) ON DELETE CASCADE ON UPDATE CASCADE,
    
    -- Índices
    INDEX idx_rutine_class (Id_Class),
    INDEX idx_rutine_active (Is_Active),
    INDEX idx_rutine_difficulty (Difficulty_Level)
);

-- ============================================================================
-- TABLA: Diet
-- Descripción: Planes de dieta disponibles
-- ============================================================================
CREATE TABLE Diet (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Description TEXT NOT NULL,
    Id_Class INT NOT NULL,
    Daily_Calories INT NULL CHECK (Daily_Calories > 0),
    Protein_Percentage DECIMAL(4,2) DEFAULT 25.00 CHECK (Protein_Percentage >= 0 AND Protein_Percentage <= 100),
    Carbs_Percentage DECIMAL(4,2) DEFAULT 45.00 CHECK (Carbs_Percentage >= 0 AND Carbs_Percentage <= 100),
    Fats_Percentage DECIMAL(4,2) DEFAULT 30.00 CHECK (Fats_Percentage >= 0 AND Fats_Percentage <= 100),
    Meals_Per_Day INT DEFAULT 5 CHECK (Meals_Per_Day > 0),
    Is_Active BOOLEAN DEFAULT TRUE,
    Created_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Claves foráneas
    FOREIGN KEY (Id_Class) REFERENCES Class(Id) ON DELETE CASCADE ON UPDATE CASCADE,
    
    -- Índices
    INDEX idx_diet_class (Id_Class),
    INDEX idx_diet_active (Is_Active),
    INDEX idx_diet_calories (Daily_Calories)
);

-- ============================================================================
-- TABLA: Rutine_Disability
-- Descripción: Relación entre rutinas y discapacidades (rutinas adaptadas)
-- ============================================================================
CREATE TABLE Rutine_Disability (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Id_Rutine INT NOT NULL,
    Id_Disability INT NOT NULL,
    Adaptation_Notes TEXT NULL,
    Created_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Claves foráneas
    FOREIGN KEY (Id_Rutine) REFERENCES Rutine(Id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (Id_Disability) REFERENCES Disability(Id) ON DELETE CASCADE ON UPDATE CASCADE,
    
    -- Evitar duplicados
    UNIQUE KEY unique_rutine_disability (Id_Rutine, Id_Disability),
    
    -- Índices
    INDEX idx_rutine_disability_rutine (Id_Rutine),
    INDEX idx_rutine_disability_disability (Id_Disability)
);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Trigger para validar que la suma de porcentajes en Diet sea 100%
DELIMITER //
CREATE TRIGGER diet_percentage_validation 
BEFORE INSERT ON Diet
FOR EACH ROW
BEGIN
    IF (NEW.Protein_Percentage + NEW.Carbs_Percentage + NEW.Fats_Percentage) != 100.00 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'La suma de porcentajes de macronutrientes debe ser igual a 100%';
    END IF;
END//

CREATE TRIGGER diet_percentage_validation_update 
BEFORE UPDATE ON Diet
FOR EACH ROW
BEGIN
    IF (NEW.Protein_Percentage + NEW.Carbs_Percentage + NEW.Fats_Percentage) != 100.00 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'La suma de porcentajes de macronutrientes debe ser igual a 100%';
    END IF;
END//
DELIMITER ;

-- ============================================================================
-- DATOS DE EJEMPLO (SEEDS)
-- ============================================================================

-- Insertar discapacidades
INSERT INTO Disability (Name) VALUES 
('Ceguera'),
('Movilidad reducida'),
('Discapacidad auditiva'),
('Discapacidad cognitiva'),
('Amputación de extremidad superior'),
('Amputación de extremidad inferior'),
('Parálisis parcial'),
('Trastornos del equilibrio');

-- Insertar clases de IMC
INSERT INTO Class (Class_Letter, Min, Max, Description) VALUES 
('A', 0.00, 18.49, 'Bajo peso - Requiere aumento controlado de peso'),
('B', 18.50, 24.99, 'Peso normal - Mantener peso actual'),
('C', 25.00, 29.99, 'Sobrepeso - Reducción moderada de peso'),
('D', 30.00, 34.99, 'Obesidad grado I - Reducción significativa de peso'),
('E', 35.00, 39.99, 'Obesidad grado II - Reducción intensiva de peso'),
('F', 40.00, 99.99, 'Obesidad grado III - Tratamiento médico especializado');

-- Insertar rutinas
INSERT INTO Rutine (Name, Description, Id_Class, Duration_Minutes, Difficulty_Level, Equipment_Required) VALUES 
-- Para bajo peso (Clase A)
('Rutina de Ganancia Muscular Básica', 'Ejercicios de fuerza básicos para incrementar masa muscular con pesas ligeras y movimientos compuestos', 1, 45, 'Beginner', 'Mancuernas, Barra olímpica'),
('Entrenamiento de Volumen Inicial', 'Rutina progresiva para ganar peso de forma saludable mediante ejercicios de resistencia', 1, 50, 'Beginner', 'Máquinas de peso, Bandas elásticas'),

-- Para peso normal (Clase B)
('Rutina de Mantenimiento Integral', 'Entrenamiento balanceado que combina fuerza y cardio para mantener la condición física', 2, 45, 'Intermediate', 'Pesas libres, Cardio'),
('Entrenamiento Funcional', 'Ejercicios que mejoran la funcionalidad del cuerpo en movimientos cotidianos', 2, 40, 'Intermediate', 'Kettlebells, TRX, Pelota medicinal'),

-- Para sobrepeso (Clase C)
('Rutina de Quema de Grasa', 'Combinación de ejercicios cardiovasculares y de fuerza para reducir peso corporal', 3, 55, 'Intermediate', 'Máquinas cardio, Pesas'),
('HIIT para Pérdida de Peso', 'Entrenamiento de intervalos de alta intensidad diseñado para maximizar la quema calórica', 3, 30, 'Advanced', 'Sin equipo específico'),

-- Para obesidad grado I (Clase D)
('Rutina Cardiovascular Moderada', 'Ejercicios de bajo impacto centrados en mejorar la resistencia cardiovascular', 4, 40, 'Beginner', 'Bicicleta estática, Elíptica'),
('Entrenamiento de Fuerza Adaptado', 'Ejercicios de resistencia adaptados para personas con obesidad, enfocados en articulaciones', 4, 35, 'Beginner', 'Máquinas de peso guiado'),

-- Para obesidad grado II (Clase E)
('Aqua Fitness', 'Ejercicios en agua que reducen el impacto en articulaciones mientras proporcionan resistencia', 5, 45, 'Beginner', 'Piscina, Flotadores'),
('Rutina de Rehabilitación', 'Programa de ejercicios supervisados para mejorar gradualmente la condición física', 5, 30, 'Beginner', 'Bandas de resistencia'),

-- Para obesidad grado III (Clase F)
('Movilidad y Flexibilidad', 'Ejercicios suaves enfocados en mejorar la movilidad y preparar el cuerpo para actividad física', 6, 25, 'Beginner', 'Colchonetas, Sillas'),
('Fisioterapia Activa', 'Programa terapéutico de movimientos controlados bajo supervisión médica', 6, 30, 'Beginner', 'Equipo de fisioterapia');

-- Insertar dietas
INSERT INTO Diet (Name, Description, Id_Class, Daily_Calories, Protein_Percentage, Carbs_Percentage, Fats_Percentage, Meals_Per_Day) VALUES 
-- Para bajo peso (Clase A)
('Dieta Hipercalórica Saludable', 'Plan alimenticio diseñado para incrementar peso de forma saludable con alimentos nutritivos', 1, 2800, 25.00, 50.00, 25.00, 6),
('Plan de Ganancia Muscular', 'Dieta rica en proteínas y carbohidratos complejos para apoyar el crecimiento muscular', 1, 3000, 30.00, 45.00, 25.00, 6),

-- Para peso normal (Clase B)
('Dieta Mediterránea Balanceada', 'Plan basado en la dieta mediterránea con énfasis en frutas, verduras y grasas saludables', 2, 2200, 20.00, 50.00, 30.00, 5),
('Plan Nutritivo Equilibrado', 'Dieta balanceada que mantiene los niveles nutricionales óptimos', 2, 2000, 25.00, 50.00, 25.00, 5),

-- Para sobrepeso (Clase C)
('Dieta de Déficit Calórico Moderado', 'Plan alimenticio con reducción calórica controlada para pérdida de peso gradual', 3, 1800, 30.00, 40.00, 30.00, 5),
('Plan Bajo en Carbohidratos', 'Dieta con reducción de carbohidratos refinados y énfasis en proteínas magras', 3, 1600, 35.00, 35.00, 30.00, 5),

-- Para obesidad grado I (Clase D)
('Dieta de Pérdida de Peso Supervisada', 'Plan nutricional restrictivo pero balanceado para pérdida de peso significativa', 4, 1500, 35.00, 35.00, 30.00, 6),
('Plan Anti-Inflamatorio', 'Dieta enfocada en alimentos que reducen la inflamación y mejoran el metabolismo', 4, 1400, 30.00, 40.00, 30.00, 6),

-- Para obesidad grado II (Clase E)
('Dieta Muy Baja en Calorías', 'Plan alimenticio estrictamente controlado bajo supervisión médica', 5, 1200, 40.00, 30.00, 30.00, 6),
('Plan Detox Nutricional', 'Dieta de depuración con alimentos naturales y suplementos específicos', 5, 1300, 35.00, 35.00, 30.00, 6),

-- Para obesidad grado III (Clase F)
('Dieta Pre-Cirugía', 'Plan nutricional especializado para preparación antes de cirugía bariátrica', 6, 1000, 45.00, 25.00, 30.00, 6),
('Plan Médico Supervisado', 'Dieta estrictamente controlada con suplementación médica especializada', 6, 1100, 40.00, 30.00, 30.00, 6);

-- Insertar rutinas adaptadas para discapacidades
INSERT INTO Rutine_Disability (Id_Rutine, Id_Disability, Adaptation_Notes) VALUES 
-- Adaptaciones para ceguera
(2, 1, 'Usar equipos con guías táctiles y descripción verbal detallada de movimientos'),
(4, 1, 'Ejercicios en espacios controlados con orientación constante del instructor'),

-- Adaptaciones para movilidad reducida
(7, 2, 'Ejercicios en silla de ruedas con adaptaciones para tren superior'),
(8, 2, 'Rutina completamente adaptada para personas con movilidad limitada'),
(9, 2, 'Ejercicios en agua que permiten movimiento sin carga en articulaciones'),

-- Adaptaciones para discapacidad auditiva
(1, 3, 'Instrucciones visuales y demostración por gestos'),
(3, 3, 'Uso de señales visuales para tiempos y repeticiones'),

-- Adaptaciones para amputaciones
(4, 5, 'Ejercicios adaptados para una sola extremidad superior'),
(6, 6, 'Modificaciones para ejercicios sin uso de extremidad inferior'),

-- Adaptaciones para parálisis parcial
(9, 7, 'Ejercicios en agua con flotación asistida'),
(10, 7, 'Fisioterapia en agua para mejorar movilidad gradualmente');

-- ============================================================================
-- VISTAS ÚTILES
-- ============================================================================

-- Vista de usuarios con información completa
CREATE VIEW v_users_complete AS
SELECT 
    u.Id as user_id,
    u.Email,
    u.Is_Active,
    u.Last_Login,
    p.Name,
    p.Lastname,
    p.Age,
    p.Gender,
    d.Name as Disability_Name,
    u.Created_Date as User_Since
FROM User u
INNER JOIN Person p ON u.Id_Person = p.Id
LEFT JOIN Disability d ON p.Id_Disability = d.Id;

-- Vista de historial con clasificación de IMC
CREATE VIEW v_history_with_classification AS
SELECT 
    h.Id,
    h.Id_User,
    h.Weight,
    h.Height,
    h.IMC,
    h.Created_Date,
    c.Class_Letter,
    c.Description as IMC_Classification
FROM History h
LEFT JOIN Class c ON h.IMC BETWEEN c.Min AND c.Max
ORDER BY h.Created_Date DESC;

-- Vista de recomendaciones por usuario
CREATE VIEW v_user_recommendations AS
SELECT 
    u.Id as user_id,
    u.Email,
    latest_imc.IMC as current_imc,
    c.Class_Letter,
    c.Description as classification,
    r.Name as rutine_name,
    r.Description as rutine_description,
    d.Name as diet_name,
    d.Description as diet_description
FROM User u
LEFT JOIN (
    SELECT Id_User, IMC, 
           ROW_NUMBER() OVER (PARTITION BY Id_User ORDER BY Created_Date DESC) as rn
    FROM History
) latest_imc ON u.Id = latest_imc.Id_User AND latest_imc.rn = 1
LEFT JOIN Class c ON latest_imc.IMC BETWEEN c.Min AND c.Max
LEFT JOIN Rutine r ON c.Id = r.Id_Class AND r.Is_Active = TRUE
LEFT JOIN Diet d ON c.Id = d.Id_Class AND d.Is_Active = TRUE;

-- ============================================================================
-- ÍNDICES ADICIONALES PARA OPTIMIZACIÓN
-- ============================================================================

-- Índices compuestos para consultas frecuentes
CREATE INDEX idx_history_user_imc_date ON History(Id_User, IMC, Created_Date);
CREATE INDEX idx_user_person_disability ON User(Id_Person) COMMENT 'Para joins frecuentes con Person y Disability';
CREATE INDEX idx_class_range_optimized ON Class(Min, Max, Class_Letter);

-- ============================================================================
-- PROCEDIMIENTOS ALMACENADOS
-- ============================================================================

-- Procedimiento para calcular IMC y obtener recomendaciones
DELIMITER //
CREATE PROCEDURE sp_calculate_imc_and_recommend(
    IN p_user_id INT,
    IN p_weight DECIMAL(5,2),
    IN p_height DECIMAL(5,2),
    OUT p_imc DECIMAL(5,2),
    OUT p_class_letter VARCHAR(5),
    OUT p_classification VARCHAR(255)
)
BEGIN
    DECLARE v_imc DECIMAL(5,2);
    DECLARE v_height_m DECIMAL(5,4);
    
    -- Calcular IMC (altura en metros)
    SET v_height_m = p_height / 100;
    SET v_imc = p_weight / (v_height_m * v_height_m);
    
    -- Insertar en historial
    INSERT INTO History (Id_User, Weight, Height, IMC) 
    VALUES (p_user_id, p_weight, p_height, v_imc);
    
    -- Obtener clasificación
    SELECT c.Class_Letter, c.Description 
    INTO p_class_letter, p_classification
    FROM Class c 
    WHERE v_imc BETWEEN c.Min AND c.Max 
    LIMIT 1;
    
    SET p_imc = v_imc;
END//
DELIMITER ;

-- ============================================================================
-- COMENTARIOS FINALES
-- ============================================================================

/*
Esta base de datos ha sido diseñada para el sistema SmithStrong con las siguientes características:

1. SEGURIDAD:
   - Uso de claves foráneas con restricciones CASCADE/SET NULL apropiadas
   - Validaciones mediante CHECK constraints
   - Triggers para validaciones complejas

2. RENDIMIENTO:
   - Índices optimizados para consultas frecuentes
   - Vistas materializadas para reportes comunes
   - Procedimientos almacenados para operaciones complejas

3. ESCALABILIDAD:
   - Estructura normalizada que permite crecimiento
   - Campos de metadatos (created_date, updated_date)
   - Soft deletes mediante campos is_active

4. FLEXIBILIDAD:
   - Sistema de clases de IMC configurable
   - Rutinas y dietas adaptables por discapacidad
   - Extensible para nuevos tipos de discapacidades y clasificaciones

5. INTEGRIDAD:
   - Constrainsts de validación en campos críticos
   - Relaciones bien definidas entre entidades
   - Triggers para mantener consistencia de datos

Para usar esta base de datos:
1. Ejecutar este script en MySQL 8.0+
2. Configurar el backend para usar las credenciales apropiadas
3. Los endpoints del frontend consumirán las APIs que interactúan con estas tablas
*/
