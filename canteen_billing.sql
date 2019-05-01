-- phpMyAdmin SQL Dump
-- version 4.0.4
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: May 01, 2019 at 04:27 AM
-- Server version: 5.6.12-log
-- PHP Version: 5.4.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `canteen_billing`
--
CREATE DATABASE IF NOT EXISTS `canteen_billing` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `canteen_billing`;

-- --------------------------------------------------------

--
-- Table structure for table `item`
--

CREATE TABLE IF NOT EXISTS `item` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `description` varchar(150) DEFAULT NULL,
  `price` float DEFAULT NULL,
  `category` varchar(200) DEFAULT NULL,
  `status` varchar(10) DEFAULT 'active',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=5 ;

--
-- Dumping data for table `item`
--

INSERT INTO `item` (`id`, `name`, `description`, `price`, `category`, `status`, `updated_at`, `created_at`) VALUES
(2, 'veg thali', 'veggies & rice', 45, 'veg,thali', 'active', '2019-04-30 18:02:22', '2019-04-30 18:02:22'),
(3, 'fish thali', 'fish & rice', 50, 'fish,thali', 'active', '2019-04-30 18:02:50', '2019-04-30 18:02:50'),
(4, 'chicken thali', 'chicken & rice', 80, 'chicken,thali', 'active', '2019-04-30 18:03:11', '2019-04-30 18:03:11');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE IF NOT EXISTS `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `total` float DEFAULT NULL,
  `item_count` int(11) DEFAULT NULL,
  `status` varchar(10) DEFAULT 'active',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `total`, `item_count`, `status`, `updated_at`, `created_at`) VALUES
(1, 0, 0, 'active', '2019-04-30 17:49:01', '2019-04-30 17:49:01');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE IF NOT EXISTS `order_items` (
  `order_id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `quantity` int(11) DEFAULT NULL,
  `rate` float DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`order_id`,`item_id`),
  KEY `item_id` (`item_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`order_id`, `item_id`, `quantity`, `rate`, `updated_at`, `created_at`) VALUES
(1, 3, 1, 50, '2019-04-30 18:30:14', '2019-04-30 18:30:14'),
(1, 4, 1, 45, '2019-04-30 18:30:14', '2019-04-30 18:30:14');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `salt` varchar(50) DEFAULT NULL,
  `passwordHash` varchar(128) DEFAULT NULL,
  `role` varchar(15) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `phone`, `salt`, `passwordHash`, `role`, `updated_at`, `created_at`) VALUES
(2, 'user 02', '123456789', 'a97f9ab49e76e961', '4bf002f8aba2124c7eb3482539e08c25b6cdbd683642b69f82cfd6d53517ad911c6081bea8708aee188b9cd22f50640ae54caae4db52a9a4c3ac865e214b2720', 'admin', '2019-04-30 15:11:53', '0000-00-00 00:00:00'),
(3, 'user 03', '45678912', '9dc68da0bba7f39b', '8caa84d6eefca0e80555a1c5b9e34e2c14ee2ee4836a2f8c1bd6e56b6f0b748428066b158dc10812cb017c6f71996606bc7af15cd7074ecfb5cd8d1074034253', 'admin', '2019-04-30 15:14:17', '0000-00-00 00:00:00');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `item` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
