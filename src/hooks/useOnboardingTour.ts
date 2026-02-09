import { useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import Shepherd from "shepherd.js";
import type { Tour } from "shepherd.js";
import "shepherd.js/dist/css/shepherd.css";

export const useOnboardingTour = () => {
  const location = useLocation();
  const tourRef = useRef<Tour | null>(null);
  const hasStarted = useRef(false);
  const { user } = useAppSelector((state) => state.auth);

  const completeTour = useCallback((tour: Tour) => {
    tour.complete();
  }, []);

  const addSteps = useCallback(
    (tour: Tour) => {
      tour.addStep({
        id: "welcome",
        title: "Welcome to Orbis!",
        text: "Let's take a quick tour to help you get started on your learning journey.",
        buttons: [
          { text: "Skip Tour", action: () => completeTour(tour), classes: "shepherd-button-secondary" },
          { text: "Let's Go →", action: tour.next, classes: "shepherd-button-primary" },
        ],
      });

      tour.addStep({
        id: "sidebar",
        title: "Navigation",
        text: "Use the sidebar to navigate between your Dashboard, Orbs, Resources, and Favourites.",
        attachTo: { element: ".sidebar", on: "right" },
        buttons: [
          { text: "← Back", action: tour.back, classes: "shepherd-button-secondary" },
          { text: "Next →", action: tour.next, classes: "shepherd-button-primary" },
        ],
      });

      tour.addStep({
        id: "explore-orbs",
        title: "Explore Orbs",
        text: "Orbs are themed learning communities. Join orbs that match your interests to see their resources in your feed.",
        attachTo: { element: 'a[href="/dashboard/orbs"]', on: "right" },
        buttons: [
          { text: "← Back", action: tour.back, classes: "shepherd-button-secondary" },
          { text: "Next →", action: tour.next, classes: "shepherd-button-primary" },
        ],
      });

      tour.addStep({
        id: "user-stats",
        title: "Your Progress",
        text: "Track your Orb Points, level, and streak here. Every action earns points — post resources, give orbs, keep your streak alive!",
        attachTo: { element: ".user-stats-card", on: "left" },
        buttons: [
          { text: "← Back", action: tour.back, classes: "shepherd-button-secondary" },
          { text: "Next →", action: tour.next, classes: "shepherd-button-primary" },
        ],
      });

      tour.addStep({
        id: "search",
        title: "Search Resources",
        text: "Use the search bar or press ⌘K to quickly find resources across all communities.",
        attachTo: { element: ".search-wrapper", on: "bottom" },
        buttons: [
          { text: "← Back", action: tour.back, classes: "shepherd-button-secondary" },
          { text: "Next →", action: tour.next, classes: "shepherd-button-primary" },
        ],
      });

      tour.addStep({
        id: "create-resource",
        title: "Share Knowledge",
        text: "Click here to create your first resource — notes, articles, code snippets, or links. Share what you know!",
        attachTo: { element: 'a[href="/dashboard/resources/new"]', on: "bottom" },
        buttons: [
          { text: "← Back", action: tour.back, classes: "shepherd-button-secondary" },
          { text: "Next →", action: tour.next, classes: "shepherd-button-primary" },
        ],
      });

      tour.addStep({
        id: "profile",
        title: "Your Profile",
        text: "View your stats, edit your bio, and track your progress. Level up from Novice to Master!",
        attachTo: { element: ".profile-trigger", on: "bottom" },
        buttons: [
          { text: "← Back", action: tour.back, classes: "shepherd-button-secondary" },
          { text: "Start Exploring!", action: () => completeTour(tour), classes: "shepherd-button-primary" },
        ],
      });
    },
    [completeTour],
  );

  // Auto-start solo al primo login (lastLoginAt è null)
  useEffect(() => {
    console.log("Tour debug:", {
      pathname: location.pathname,
      user: !!user,
      lastLoginAt: user?.lastLoginAt,
      hasStarted: hasStarted.current,
    });

    if (location.pathname !== "/dashboard") return;
    if (!user) return;
    if (user.lastLoginAt) return;
    if (hasStarted.current) return;

    const timeout = setTimeout(() => {
      if (!document.querySelector(".sidebar")) return;

      hasStarted.current = true;

      const tour = new Shepherd.Tour({
        useModalOverlay: true,
        defaultStepOptions: {
          classes: "orbis-tour",
          scrollTo: { behavior: "smooth", block: "center" },
          cancelIcon: { enabled: true },
          modalOverlayOpeningPadding: 8,
          modalOverlayOpeningRadius: 12,
        },
      });

      tourRef.current = tour;
      addSteps(tour);
      tour.start();
    }, 1200);

    return () => {
      clearTimeout(timeout);
      if (tourRef.current) {
        tourRef.current.cancel();
      }
    };
  }, [location.pathname, user, addSteps]);

  // Restart manuale (dal bottone ? nella navbar)
  const restartTour = useCallback(() => {
    if (tourRef.current) {
      tourRef.current.cancel();
    }
    hasStarted.current = false;

    setTimeout(() => {
      if (!document.querySelector(".sidebar")) return;

      const tour = new Shepherd.Tour({
        useModalOverlay: true,
        defaultStepOptions: {
          classes: "orbis-tour",
          scrollTo: { behavior: "smooth", block: "center" },
          cancelIcon: { enabled: true },
          modalOverlayOpeningPadding: 8,
          modalOverlayOpeningRadius: 12,
        },
      });

      tourRef.current = tour;
      addSteps(tour);
      tour.start();
    }, 300);
  }, [addSteps]);

  return { restartTour };
};
