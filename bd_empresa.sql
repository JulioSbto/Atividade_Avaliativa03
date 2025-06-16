-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 12-Jun-2025 às 00:08
-- Versão do servidor: 10.4.27-MariaDB
-- Versão do PHP: 8.1.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS `bd_empresa` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `bd_empresa`;

-- --------------------------------------------------------
-- Tabela: filiais
-- --------------------------------------------------------
CREATE TABLE `filiais` (
  `codigo_filial` INT(11) NOT NULL,
  `nome_filial` VARCHAR(100) DEFAULT NULL,
  `endereco` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`codigo_filial`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dados da tabela filiais
INSERT INTO `filiais` (`codigo_filial`, `nome_filial`, `endereco`) VALUES
(1, 'Matriz Central', 'Rua Princial, 100'),
(2, 'Filial Norte', 'Avenida das Flores, 200'),
(3, 'Filial Sul', 'Rua do Comércio, 50'),
(4, 'Filial Leste', 'Avenida Leste-Oeste, 123'),
(5, 'Filial Oeste', 'Rua das Palmeiras, 321');

-- --------------------------------------------------------
-- Tabela: funcionarios (nome padronizado)
-- --------------------------------------------------------
CREATE TABLE `funcionarios` (
  `matricula` INT(11) NOT NULL AUTO_INCREMENT,
  `nome_funcionario` VARCHAR(100) DEFAULT NULL,
  `codigo_filial` INT(11) DEFAULT NULL,
  `salario` DECIMAL(10,2) DEFAULT NULL,
  `setor` ENUM('Financeiro','Administrativo','Suporte') DEFAULT NULL,
  `status` ENUM('Ativo','Inativo') DEFAULT NULL,
  PRIMARY KEY (`matricula`),
  KEY `codigo_filial` (`codigo_filial`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dados da tabela funcionarios
INSERT INTO `funcionarios` (`matricula`, `nome_funcionario`, `codigo_filial`, `salario`, `setor`, `status`) VALUES
(1, 'Arthur Souza', 1, '3500.00', 'Financeiro', 'Ativo'),
(2, 'Carlos Moura', 2, '2800.50', 'Administrativo', 'Ativo'),
(3, 'Juliana Lima', 3, '3200.75', 'Suporte', 'Inativo'),
(4, 'Davisson Caue', 4, '4000.00', 'Financeiro', 'Ativo'),
(5, 'Joao Victor', 5, '2950.90', 'Suporte', 'Ativo'),
(6, 'Everson Pedroza', 1, '3500.00', 'Financeiro', 'Ativo'),
(7, 'Augusto Guilherme', 2, '2800.50', 'Administrativo', 'Ativo'),
(8, 'Tarcisio de Lima', 3, '3200.75', 'Suporte', 'Inativo'),
(9, 'Rafaela Bastos', 4, '4000.00', 'Financeiro', 'Inativo'),
(10, 'João Pedro Cardoso', 5, '2950.90', 'Suporte', 'Ativo');

ALTER TABLE `funcionarios` AUTO_INCREMENT = 11;

-- --------------------------------------------------------
-- Tabela: usuarios
-- --------------------------------------------------------
CREATE TABLE `usuarios` (
  `codigo_usuario` INT(11) NOT NULL,
  `username` VARCHAR(50) DEFAULT NULL,
  `password` VARCHAR(100) DEFAULT NULL,
  PRIMARY KEY (`codigo_usuario`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dados da tabela usuarios
INSERT INTO `usuarios` (`codigo_usuario`, `username`, `password`) VALUES
(1, 'ArthurS', 'senha1234'),
(2, 'csouza', 'senha456'),
(3, 'jlima', 'senha789'),
(4, 'davi_caue', 'senha321'),
(5, 'Jao_victor', 'senha120'),
(6, 'JulioSbto', 'senha357');

-- --------------------------------------------------------
-- View: vw_funcionarios_filiais (com nome_funcionario e codigo_filial)
-- --------------------------------------------------------
CREATE OR REPLACE VIEW `vw_funcionarios_filiais` AS
SELECT 
  f.`matricula`,
  f.`nome_funcionario`,
  f.`salario`,
  f.`setor`,
  f.`status`,
  f.`codigo_filial`,
  fl.`nome_filial`,
  fl.`endereco`
FROM `funcionarios` f
JOIN `filiais` fl ON f.`codigo_filial` = fl.`codigo_filial`;

-- --------------------------------------------------------
-- Foreign Key
-- --------------------------------------------------------
ALTER TABLE `funcionarios`
  ADD CONSTRAINT `funcionarios_ibfk_1` FOREIGN KEY (`codigo_filial`) REFERENCES `filiais` (`codigo_filial`);

COMMIT;
