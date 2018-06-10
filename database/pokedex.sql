-- phpMyAdmin SQL Dump
-- version 4.6.5.2
-- https://www.phpmyadmin.net/
--
-- Client :  localhost:8889
-- Généré le :  Dim 10 Juin 2018 à 23:43
-- Version du serveur :  5.6.35
-- Version de PHP :  7.0.15

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `pokedex`
--

-- --------------------------------------------------------

--
-- Structure de la table `capture`
--

CREATE TABLE `capture` (
  `id` int(11) NOT NULL,
  `pokemon_id` smallint(6) NOT NULL,
  `user_id` int(11) NOT NULL,
  `number` int(11) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `capture`
--

INSERT INTO `capture` (`id`, `pokemon_id`, `user_id`, `number`) VALUES
(1, 18, 1, 7),
(2, 95, 1, 5),
(3, 20, 1, 3),
(4, 128, 1, 4),
(5, 132, 1, 1),
(6, 15, 1, 6),
(7, 71, 1, 1),
(8, 65, 1, 1),
(9, 119, 1, 2),
(10, 9, 1, 1),
(11, 18, 2, 1),
(12, 110, 1, 1),
(13, 126, 1, 1),
(14, 12, 1, 6),
(15, 53, 1, 1),
(16, 45, 1, 1),
(17, 47, 1, 1),
(18, 12, 2, 1),
(19, 128, 2, 2),
(20, 59, 2, 1),
(21, 57, 2, 1),
(22, 15, 2, 5),
(23, 113, 2, 1),
(24, 47, 2, 1),
(25, 6, 2, 1),
(26, 80, 2, 1),
(27, 40, 1, 1),
(28, 31, 1, 1),
(29, 51, 1, 1),
(30, 115, 1, 1),
(31, 59, 1, 2);

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `ip` tinytext NOT NULL,
  `catching` smallint(255) DEFAULT NULL,
  `position_x` tinyint(255) NOT NULL DEFAULT '0',
  `position_y` tinyint(255) NOT NULL DEFAULT '30'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `users`
--

INSERT INTO `users` (`id`, `ip`, `catching`, `position_x`, `position_y`) VALUES
(1, '12ca17b49af2289436f303e0166030a21e525d266e209267433801a8fd4071a0', NULL, 35, 15),
(2, 'eff8e7ca506627fe15dda5e0e512fcaad70b6d520f37cc76597fdb4f2d83a1a3', NULL, 40, 25);

--
-- Index pour les tables exportées
--

--
-- Index pour la table `capture`
--
ALTER TABLE `capture`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables exportées
--

--
-- AUTO_INCREMENT pour la table `capture`
--
ALTER TABLE `capture`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;
--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
