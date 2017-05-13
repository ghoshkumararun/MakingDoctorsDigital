-- phpMyAdmin SQL Dump
-- version 4.5.2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: May 13, 2017 at 11:50 PM
-- Server version: 10.1.13-MariaDB
-- PHP Version: 5.6.20

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `MDD`
--

-- --------------------------------------------------------

--
-- Table structure for table `doctor_info`
--

CREATE TABLE `doctor_info` (
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `doctor_id` bigint(20) NOT NULL,
  `phone_number` bigint(20) NOT NULL,
  `address` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `doctor_info`
--

INSERT INTO `doctor_info` (`first_name`, `last_name`, `email`, `password`, `doctor_id`, `phone_number`, `address`) VALUES
('Mohut', 'Patel', 'patel.mohit@gmail.com', '44072ea82a7494ac00d3f22cd04048b5', 2, 9999999999, '1 kjhbfkjhb, San Jose, CA- 95126');

-- --------------------------------------------------------

--
-- Table structure for table `patient_info`
--

CREATE TABLE `patient_info` (
  `patient_id` int(20) NOT NULL,
  `first_name` varchar(20) NOT NULL,
  `last_name` varchar(20) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone_number` bigint(10) NOT NULL,
  `address` varchar(500) NOT NULL,
  `cCCNo` bigint(20) NOT NULL,
  `cCVV` int(3) NOT NULL,
  `cExpDate` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `patient_info`
--

INSERT INTO `patient_info` (`patient_id`, `first_name`, `last_name`, `email`, `password`, `phone_number`, `address`, `cCCNo`, `cCVV`, `cExpDate`) VALUES
(1, 'Mohit', 'Patel', 'patel.mohit@ymail.com', 'Mohit123!', 9988776655, '1 Washington Sq, San Jose, CA - 95126', 999988887777666655, 456, '01/19'),
(2, 'Mohit', 'Patel', 'mohit.patel@sjsu.edu', '44072ea82a7494ac00d3f22cd04048b5', 9985668222, '1 Washington Squar, San Jose, CA- 95126', 8888777799994444, 544, '01/2016'),
(3, 'Yogesh', 'Chauhan', 'yogesh.chhn@gmail.com', '88a2c2c02b30a5f5b0e678782fd4bf16', 9998855588, '754 The Alameda, San Jose, CA- 95126', 6546468468464654654, 889, '01/2017');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `doctor_info`
--
ALTER TABLE `doctor_info`
  ADD PRIMARY KEY (`doctor_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `phone_number` (`phone_number`);

--
-- Indexes for table `patient_info`
--
ALTER TABLE `patient_info`
  ADD PRIMARY KEY (`patient_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `phone_number` (`phone_number`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `doctor_info`
--
ALTER TABLE `doctor_info`
  MODIFY `doctor_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `patient_info`
--
ALTER TABLE `patient_info`
  MODIFY `patient_id` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
