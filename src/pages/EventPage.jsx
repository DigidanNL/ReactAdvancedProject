import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Image,
  Tag,
  HStack,
  Button,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";

const EventPage = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const cancelRef = React.useRef();
  const toast = useToast();
  const navigate = useNavigate(); // Gebruik de navigate functie om te redirecten

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`http://localhost:3000/events/${eventId}`);
        if (!response.ok) throw new Error("Netwerkrespons was niet ok");
        const data = await response.json();
        setEvent(data);
      } catch (error) {
        console.error("Fout bij het ophalen van het evenement:", error);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`http://localhost:3000/events/${eventId}`, {
        method: "DELETE",
      });
      if (!response.ok)
        throw new Error("Fout bij het verwijderen van het evenement");

      toast({
        title: "Evenement verwijderd",
        description: "Het evenement is succesvol verwijderd.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/"); // Navigeer terug naar de evenementenlijst
    } catch (error) {
      toast({
        title: "Fout",
        description:
          "Er is een fout opgetreden bij het verwijderen van het evenement.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      console.error("Fout bij het verwijderen van het evenement:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!event) return <Text>Evenement wordt geladen...</Text>;

  return (
    <Box padding="4">
      <Heading as="h1" size="lg" mb="4">
        {event.title}
      </Heading>
      <Text mb="2">{event.description}</Text>
      {event.image && (
        <Image src={event.image} alt={event.title} mb="4" borderRadius="md" />
      )}
      <Text fontSize="sm" color="gray.500">
        Start: {new Date(event.startTime).toLocaleString()}
      </Text>
      <Text fontSize="sm" color="gray.500">
        Eind: {new Date(event.endTime).toLocaleString()}
      </Text>
      <HStack spacing={2} mt="2">
        {event.categories &&
          event.categories.map((category, index) => (
            <Tag key={index} colorScheme="blue">
              {category}
            </Tag>
          ))}
      </HStack>

      {/* Delete Button */}
      <Button colorScheme="red" onClick={() => setIsAlertOpen(true)} mt="4">
        Verwijder Evenement
      </Button>

      {/* Alert Dialog for Confirmation */}
      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsAlertOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Evenement Verwijderen
            </AlertDialogHeader>

            <AlertDialogBody>
              Weet je zeker dat je dit evenement wilt verwijderen? Deze actie
              kan niet ongedaan gemaakt worden.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsAlertOpen(false)}>
                Annuleren
              </Button>
              <Button
                colorScheme="red"
                onClick={handleDelete}
                ml={3}
                isLoading={isDeleting}
              >
                Verwijder
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default EventPage;
