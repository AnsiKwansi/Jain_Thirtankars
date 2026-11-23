/* Roster for the working split, plus the public note on About.
   bio is what a stranger on the site will read. Keep it to a few sentences.
   Leave bio as "" until you are ready. No phone numbers, emails, or school details.
   speakingSeat stays null until that person chooses one seat from their own set.
*/
window.PROJECT = {
  event: "Jain Darshan",
  program: "PVSA",
  teamName: "Team 1",
  topic: "Jain Tirthankaras and their teachings",
  youthLead: "Om",
  mentors: [
    { name: "Milap Sheth", role: "Parent lead" },
    { name: "Vishal Shah", role: "Parent co-mentor" }
  ]
};

window.ROSTER = [
  {
    id: "anant",
    name: "Anant",
    seats: [1, 2, 3, 4, 5],
    lens: "Origins",
    lensIdea:
      "For each seat, ask what begins here: a practice, a limit, or a way of seeing. Spend the most words on that beginning. A full life story can stay short.",
    duty: "Writes seats 1–5 and looks after this foundation. If the whole team needs a new blank question, Anant adds the field. He does not write anyone else's seat.",
    bio: "",
    speakingSeat: null
  },
  {
    id: "aarav",
    name: "Aarav",
    seats: [6, 7, 8, 9, 10],
    lens: "Emblems",
    lensIdea:
      "Once an emblem is confirmed, lead with it. Say what it is and what you want us to notice. If two traditions name different emblems, write both and say which source said which.",
    duty: "Writes seats 6–10. Same questions as every other set. The emblem is where these five can go deeper.",
    bio: "",
    speakingSeat: null
  },
  {
    id: "om",
    name: "Om",
    lead: true,
    seats: [11, 12, 13, 14, 15],
    lens: "Decisions",
    lensIdea:
      "Choose one decision in the life. Say what that decision protected, and what a similar decision looks like for someone our age.",
    duty: "Writes seats 11–15. As youth lead, Om also runs the weekly meeting and the order of the November presentation.",
    bio: "",
    speakingSeat: null
  },
  {
    id: "mehul",
    name: "Mehul",
    seats: [16, 17, 18, 19, 20],
    lens: "Practice",
    lensIdea:
      "Write the daily-life practice first. Then keep only the history a reader needs in order to understand that practice.",
    duty: "Writes seats 16–20. Same questions as every other set. The practice for a normal week is where these five can go deeper.",
    bio: "",
    speakingSeat: null
  },
  {
    id: "rishik",
    name: "Rishik",
    seats: [21, 22, 23, 24],
    lens: "Near to us",
    lensIdea:
      "Give Parshvanatha and Mahavira the time they need, and ask what still reaches a student now. Write the shared page only after the other sets have drafts, and only from what those drafts actually say.",
    duty: "Writes seats 21–24 and the shared page. Four seats plus that page matches a set of five.",
    bio: "",
    speakingSeat: null
  }
];
