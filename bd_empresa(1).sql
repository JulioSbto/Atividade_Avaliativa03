-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 12-Jun-2025 às 00:08
-- Versão do servidor: 10.4.27-MariaDB
-- versão do PHP: 8.1.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `bd_empresa`
--
CREATE DATABASE IF NOT EXISTS `bd_empresa` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `bd_empresa`;

-- --------------------------------------------------------

--
-- Estrutura da tabela `filiais`
--

CREATE TABLE `filiais` (
  `codigo_filial` int(11) NOT NULL,
  `nome_filial` varchar(100) DEFAULT NULL,
  `endereco` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `filiais`
--

INSERT INTO `filiais` (`codigo_filial`, `nome_filial`, `endereco`) VALUES
(1, 'Matriz Central', 'Rua Princial, 100'),
(2, 'Filial Norte', 'Avenida das Flores, 200'),
(3, 'Filial Sul', 'Rua do Comércio, 50'),
(4, 'Filial Leste', 'Avenida Leste-Oeste, 123'),
(5, 'Filial Oeste', 'Rua das Palmeiras, 321');

-- --------------------------------------------------------

--
-- Estrutura da tabela `funcionarios`
--

CREATE TABLE `funcionarios` (
  `matricula` int(11) NOT NULL,
  `nome` varchar(100) DEFAULT NULL,
  `codigo_filial` int(11) DEFAULT NULL,
  `salario` decimal(10,2) DEFAULT NULL,
  `setor` enum('Financeiro','Administrativo','Suporte') DEFAULT NULL,
  `status` enum('Ativo','Inativo') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `funcionarios`
--

INSERT INTO `funcionarios` (`matricula`, `nome`, `codigo_filial`, `salario`, `setor`, `status`) VALUES
(102, 'Arthur Souza', 1, '3500.00', 'Financeiro', 'Ativo'),
(103, 'Carlos Moura', 2, '2800.50', 'Administrativo', 'Ativo'),
(104, 'Juliana Lima', 3, '3200.75', 'Suporte', 'Inativo'),
(105, 'Davisson caue', 4, '4000.00', 'Financeiro', 'Ativo'),
(106, 'Joao Victor', 5, '2950.90', 'Suporte', 'Ativo'),
(201, 'Arthur Souza', 1, '3500.00', 'Financeiro', 'Ativo'),
(202, 'Carlos Moura', 2, '2800.50', 'Administrativo', 'Ativo'),
(203, 'Juliana Lima', 3, '3200.75', 'Suporte', 'Inativo'),
(204, 'Davisson Caue', 4, '4000.00', 'Financeiro', 'Ativo'),
(205, 'João Victor', 5, '2950.90', 'Suporte', 'Ativo');

-- --------------------------------------------------------

--
-- Estrutura da tabela `usuarios`
--

CREATE TABLE `usuarios` (
  `codigo_usuario` int(11) NOT NULL,
  `username` varchar(50) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `usuarios`
--

INSERT INTO `usuarios` (`codigo_usuario`, `username`, `password`) VALUES
(1, 'ArthurS', 'senha1234'),
(2, 'csouza', 'senha456'),
(3, 'jlima', 'senha789'),
(4, 'davi_caue', 'senha321'),
(5, 'Jao_victor', 'senha120');

-- --------------------------------------------------------

--
-- Estrutura stand-in para vista `vw_funcionarios_filiais`
-- (Veja abaixo para a view atual)
--
CREATE TABLE `vw_funcionarios_filiais` (
`matricula` int(11)
,`nome_funcionario` varchar(100)
,`salario` decimal(10,2)
,`setor` enum('Financeiro','Administrativo','Suporte')
,`status` enum('Ativo','Inativo')
,`codigo_filial` int(11)
,`nome_filial` varchar(100)
,`endereco` varchar(255)
);

-- --------------------------------------------------------

--
-- Estrutura para vista `vw_funcionarios_filiais`
--
DROP TABLE IF EXISTS `vw_funcionarios_filiais`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_funcionarios_filiais`  AS SELECT `f`.`matricula` AS `matricula`, `f`.`nome` AS `nome_funcionario`, `f`.`salario` AS `salario`, `f`.`setor` AS `setor`, `f`.`status` AS `status`, `fl`.`codigo_filial` AS `codigo_filial`, `fl`.`nome_filial` AS `nome_filial`, `fl`.`endereco` AS `endereco` FROM (`funcionarios` `f` join `filiais` `fl` on(`f`.`codigo_filial` = `fl`.`codigo_filial`))  ;

--
-- Índices para tabelas despejadas
--

--
-- Índices para tabela `filiais`
--
ALTER TABLE `filiais`
  ADD PRIMARY KEY (`codigo_filial`);

--
-- Índices para tabela `funcionarios`
--
ALTER TABLE `funcionarios`
  ADD PRIMARY KEY (`matricula`),
  ADD KEY `codigo_filial` (`codigo_filial`);

--
-- Índices para tabela `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`codigo_usuario`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Restrições para despejos de tabelas
--

--
-- Limitadores para a tabela `funcionarios`
--
ALTER TABLE `funcionarios`
  ADD CONSTRAINT `funcionarios_ibfk_1` FOREIGN KEY (`codigo_filial`) REFERENCES `filiais` (`codigo_filial`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
