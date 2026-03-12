// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import {  pgTableCreator } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator(
  (name) => `oliverkeenanlyu3.0_${name}`,
);

import { pgTable, text, timestamp, jsonb } from "drizzle-orm/pg-core";

export const smartLinks = pgTable("smart_links", {
  spotifyId: text("spotify_id").primaryKey(),
  isrc:      text("isrc"),
  name:      text("name"),
  imageUrl:  text("image_url"),
  albumType: text("album_type").default("album").notNull(),
  data:      jsonb("data").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

