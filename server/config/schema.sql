-- =============================================
-- Campus Marketplace Database Schema
-- =============================================

CREATE DATABASE IF NOT EXISTS campus_marketplace;
USE campus_marketplace;

-- -----------------------------------------------
-- Users
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username     VARCHAR(50)  NOT NULL UNIQUE,
  email        VARCHAR(100) NOT NULL UNIQUE,
  password     VARCHAR(255) NOT NULL,
  role         ENUM('user','admin') NOT NULL DEFAULT 'user',
  is_banned    TINYINT(1)   NOT NULL DEFAULT 0,
  avatar       VARCHAR(255)          DEFAULT NULL,
  created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- -----------------------------------------------
-- Categories
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
  id    INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name  VARCHAR(100) NOT NULL UNIQUE
);

INSERT IGNORE INTO categories (name) VALUES
  ('Books'),
  ('Electronics'),
  ('Clothing'),
  ('Furniture'),
  ('Sports'),
  ('Stationery'),
  ('Other');

-- -----------------------------------------------
-- Products
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS products (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  seller_id    INT UNSIGNED NOT NULL,
  category_id  INT UNSIGNED NOT NULL,
  title        VARCHAR(200) NOT NULL,
  description  TEXT         NOT NULL,
  price        DECIMAL(10,2) NOT NULL,
  status       ENUM('available','sold') NOT NULL DEFAULT 'available',
  image        VARCHAR(255)  DEFAULT NULL,
  created_at   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (seller_id)   REFERENCES users(id)      ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
);

-- Full-text index for search
ALTER TABLE products ADD FULLTEXT INDEX ft_search (title, description);

-- -----------------------------------------------
-- Reviews (buyers review sellers)
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS reviews (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  seller_id   INT UNSIGNED NOT NULL,
  reviewer_id INT UNSIGNED NOT NULL,
  rating      TINYINT      NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment     TEXT         DEFAULT NULL,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_review (seller_id, reviewer_id),
  FOREIGN KEY (seller_id)   REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE
);

-- -----------------------------------------------
-- View: seller average ratings
-- -----------------------------------------------
CREATE OR REPLACE VIEW seller_ratings AS
SELECT
  seller_id,
  ROUND(AVG(rating), 1)  AS avg_rating,
  COUNT(*)               AS review_count
FROM reviews
GROUP BY seller_id;
