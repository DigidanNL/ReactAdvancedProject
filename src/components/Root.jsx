import React from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import Navigation from "./Navigation";
import EventsPage from "../pages/EventsPage";
import EventPage from "../pages/EventPage";

export const Root = () => {
  return (
    <Box>
      <Navigation />
      <Outlet />
    </Box>
  );
};

// Voeg de routes toe
const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Root />}>
      <Route index element={<EventsPage />} />
      <Route path="event/:eventId" element={<EventPage />} />
    </Route>
  </Routes>
);

export default AppRoutes;
