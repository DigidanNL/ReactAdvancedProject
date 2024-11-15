import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  List,
  ListItem,
  Text,
  Image,
  HStack,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
  Select,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

export const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    image: "",
    startTime: "",
    endTime: "",
    categories: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Haal de evenementen op van de JSON-server
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:3000/events");
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Fout bij het ophalen van evenementen:", error);
      }
    };
    fetchEvents();
  }, []);

  // Event toevoegen
  const handleAddEvent = async () => {
    try {
      const response = await fetch("http://localhost:3000/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newEvent,
          categories: newEvent.categories.split(",").map((cat) => cat.trim()),
        }),
      });
      if (!response.ok) throw new Error("Fout bij het toevoegen van evenement");
      const createdEvent = await response.json();
      setEvents([...events, createdEvent]);
      setNewEvent({
        title: "",
        description: "",
        image: "",
        startTime: "",
        endTime: "",
        categories: "",
      });
      onClose(); // Sluit de modal na het toevoegen
    } catch (error) {
      console.error("Fout bij het toevoegen van evenement:", error);
    }
  };

  // Event bewerken
  const handleEditEvent = (event) => {
    setNewEvent(event); // Vul de form met de huidige event data
    onOpen(); // Open de modal voor bewerking
  };

  // Event verwijderen
  const handleDeleteEvent = async (eventId) => {
    try {
      const response = await fetch(`http://localhost:3000/events/${eventId}`, {
        method: "DELETE",
      });
      if (!response.ok)
        throw new Error("Fout bij het verwijderen van evenement");
      setEvents(events.filter((event) => event.id !== eventId)); // Verwijder event uit de lijst
    } catch (error) {
      console.error("Fout bij het verwijderen van evenement:", error);
    }
  };

  // Filter de evenementen op basis van zoekterm en geselecteerde categorie
  const filteredEvents = events
    .filter((event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((event) =>
      selectedCategory ? event.categories.includes(selectedCategory) : true
    );

  // Haal alle unieke categorieën op voor het filtermenu
  const allCategories = Array.from(
    new Set(events.flatMap((event) => event.categories))
  );

  return (
    <Box padding="4">
      <Heading as="h1" size="lg" mb="4">
        Onze Evenementen
      </Heading>

      {/* Zoekveld */}
      <Input
        placeholder="Zoek evenementen"
        mb="4"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Filter op categorie */}
      <Select
        placeholder="Filter op categorie"
        mb="4"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        {allCategories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </Select>

      <Button colorScheme="blue" onClick={onOpen} mb="4">
        Add Event
      </Button>

      <List spacing="6">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <ListItem
              key={event.id}
              border="1px solid #ddd"
              padding="4"
              borderRadius="md"
              boxShadow="sm"
            >
              <Link to={`/event/${event.id}`}>
                <Heading as="h2" size="md" mb="2">
                  {event.title}
                </Heading>
                <Text mb="2">{event.description}</Text>
                {event.image && (
                  <Image
                    src={event.image}
                    alt={event.title}
                    className="event-image"
                    mb="4"
                    borderRadius="md"
                  />
                )}
                <Text fontSize="sm" color="gray.500">
                  Start: {new Date(event.startTime).toLocaleString()}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  End: {new Date(event.endTime).toLocaleString()}
                </Text>
              </Link>
              {/* Bewerk en verwijder knoppen */}
              <HStack spacing="2" mt="2">
                <Button
                  colorScheme="yellow"
                  onClick={() => handleEditEvent(event)}
                >
                  Bewerken
                </Button>
                <Button
                  colorScheme="red"
                  onClick={() => handleDeleteEvent(event.id)}
                >
                  Verwijderen
                </Button>
              </HStack>
            </ListItem>
          ))
        ) : (
          <Text>Geen evenementen gevonden...</Text>
        )}
      </List>

      {/* Modal voor het toevoegen van een evenement */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Nieuw Evenement Toevoegen</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb="4">
              <FormLabel>Titel</FormLabel>
              <Input
                value={newEvent.title}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, title: e.target.value })
                }
              />
            </FormControl>
            <FormControl mb="4">
              <FormLabel>Beschrijving</FormLabel>
              <Input
                value={newEvent.description}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, description: e.target.value })
                }
              />
            </FormControl>
            <FormControl mb="4">
              <FormLabel>Afbeeldings-URL</FormLabel>
              <Input
                value={newEvent.image}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, image: e.target.value })
                }
              />
            </FormControl>
            <FormControl mb="4">
              <FormLabel>Starttijd</FormLabel>
              <Input
                type="datetime-local"
                value={newEvent.startTime}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, startTime: e.target.value })
                }
              />
            </FormControl>
            <FormControl mb="4">
              <FormLabel>Eindtijd</FormLabel>
              <Input
                type="datetime-local"
                value={newEvent.endTime}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, endTime: e.target.value })
                }
              />
            </FormControl>
            <FormControl mb="4">
              <FormLabel>Categorieën</FormLabel>
              <Input
                value={newEvent.categories}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, categories: e.target.value })
                }
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleAddEvent}>
              Opslaan
            </Button>
            <Button onClick={onClose} ml="3">
              Annuleren
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
export default EventsPage;
