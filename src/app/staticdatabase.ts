import {Answer, Question} from "./models/question";

export class Database {
  static questionList: Question[] = [
    new Question("Which of the following statements is/are correct?", [
      new Answer("Architectures are mostly shaped by functional requirements", false),
      new Answer("Architectures are mostly shaped by quality attribute requirements", true),
      new Answer("Functional and QA requirements shape architecture to the same extent", false),
      new Answer("Features and functionality shape the architecture less than QA reqts", true),
    ]),

    new Question("When does a software system have an architecture?", [
      new Answer("When there are many stakeholders involved", false),
      new Answer("When functional and quality requirements need to be balanced", false),
      new Answer("When design takes place before an agreement with the customer is reached", false),
      new Answer("Always", true),
    ]),

    new Question("Which of the following are reasons that architecture is important?", [
      new Answer("A documented architecture enhances communication among stakeholders.", true),
      new Answer("Systems without an architecture cannot be properly built.", false),
      new Answer("An architecture will inhibit or enable a system's driving quality attributes.", true),
      new Answer("An architecture reflects the desired functionality as expressed by stakeholders.", false),
    ]),

    new Question("When are requirements defined as 'architecturally significant requirements' (or ASRs)?", [
      new Answer("When they are prioritized.", false),
      new Answer("When they have a profound influence on the architecture.", true),
      new Answer("When they come from business goals.", false),
      new Answer("Due to their global influence, all business requirements are ASRs.", false),
    ]),

    new Question("Which of the following statements correctly describe the relation between architecture and business goals? Select all that apply.", [
      new Answer("Business goals often determine quality attribute requirements.", true),
      new Answer("Business goals may influence the architecture without any relation to any quality attribute requirement.", true),
      new Answer("Only some kinds of business goals may be related to architecture.", true),
      new Answer("When expressed as ASRs (architecturally significant requirements), business goal scenarios become quality attribute scenarios.", false),
    ]),

    new Question("The sentence 'The system shall exhibit high availability' is an adequately expressed quality attribute requirement?", [
      new Answer("Agree", false),
      new Answer("Disagree", true),
    ]),

    new Question("Which of the following statements about views and viewpoints is/are CERTAINLY CORRECT?", [
      new Answer("A viewpoints defines how a view should be constructed and interpreted.", true),
      new Answer("The UML class diagram notation is a view representing the structure of a system or sub-system.", false),
      new Answer("An architecture viewpoint frames one or multiple concerns. A concern can be framed by more than one viewpoint.", true),
      new Answer("A view can be used by multiple stakeholders, but represent only the concerns of a single, predefined stakeholder.", false),
    ]),

    new Question("Which of the following statements regarding views and viewpoints is/are CERTAINLY CORRECT?", [
      new Answer("A viewpoint can be used to construct a view.", true),
      new Answer("A viewpoint expresses the architecture of a system from the perspective of specific system concerns", false),
      new Answer("A viewpoint can be used to interpret a view.", true),
      new Answer("A viewpoint conforms to a view.", false),
    ]),

    new Question("What does the 'Rationale' section of a view's documentation contain?", [
      new Answer("It contains the reason why that view has been selected.", false),
      new Answer("It explains for which stakeholders the view is relevant.", false),
      new Answer("It explains why the design reflected in the view came to be.", true),
      new Answer("It contains all design decisions for the system's architectural design.", false),
    ]),

    new Question("What is the purpose of the Element Catalog in the documentation of a view?", [
      new Answer("It details the elements depicted in the primary presentation.", true),
      new Answer("It provides a legend for the symbols used in the view.", false),
      new Answer("It explains why the design depicted in the view came to be.", false),
      new Answer("It tells how the documentation is laid out and organized so that a stakeholder can find the information he or she needs.", false),
    ]),

    new Question("Which of the following topics is or are part of the Beyond Views documentation? Select all that apply.", [
      new Answer("The documentation roadmap.", true),
      new Answer("The primary presentation.", false),
      new Answer("A mapping between views.", true),
      new Answer("The element catalog.", false),
    ]),

    new Question("What does the Rationale section of the 'beyond views' documentation contain?", [
      new Answer("It explains why the design reflected in the view came to be.", false),
      new Answer("It explains why the views in the architecture description have been selected.", false),
      new Answer("It contains a description of the relations between the views.", false),
      new Answer("It contains the architectural decisions that apply to more than one view.", true),
    ]),

    new Question("This figure shows a peer-to-peer view of a Gnutella network using an informal notation. What kind of structure is depicted in the view?", [
        new Answer("There are no structures in the view.", false),
        new Answer("A component-and-connector structure.", true),
        new Answer("An allocation structure.", false),
        new Answer("A module structure.", false),
      ],
      "https://i.imgur.com/n4W7oAr.png"
    ),

    new Question("This figure represents part of", [
        new Answer("A view.", false),
        new Answer("A viewpoint definition.", true),
        new Answer("A model kind.", false),
        new Answer("A design pattern.", false),
      ],"https://i.imgur.com/Tjx109N.png"
    ),

    new Question("An architect may quickly decide to migrate data management to the public cloud because it worked well in a previous project. This is an example of:", [
      new Answer("Absolute rationality.", false),
      new Answer("Bounded rationality.", true),
      new Answer("Social/cultural rationality.", false),
    ]),

    new Question("Hofmeister et al. present the concept of an 'architecture backlog'. What does it entail?", [
      new Answer("The description of the design space for the project at hand.", false),
      new Answer("A kind of todo list for the project at hand.", true),
      new Answer("An overview of the design options and the decisions taken.", false),
      new Answer("The list of a.o. design issues, architecture significant requirements, ideas and constraints that an architect stores for future reuse.", false),
    ]),

    new Question("Why is documenting design decisions important? Select all options that are certainly correct. Documenting design decisions...", [
      new Answer("prioritizes the important decisions.", false),
      new Answer("shows you when the design is done.", false),
      new Answer("prevents repeating past steps.", true),
      new Answer("explains why the architecture is a good architecture.", true),
    ]),

    new Question("According to Tyree and Ackerman's template for modeling a design decision, which of the following elements of a design decision should be captured?", [
      new Answer("Constraints", true),
      new Answer("Assumptions", true),
      new Answer("Implications", true),
      new Answer("Alternatives", true),
    ]),

    new Question("Which of the following statements about the Attribute Driven Design method (ADD) is or are certainly true? Select all that apply.", [
      new Answer("ADD uses a breadth-first refinement strategy.", false),
      new Answer("ADD is an application of the generate-and-test philosophy.", true),
      new Answer("ADD ends once the entire system is selected as the final element to design.", false),
      new Answer("ADD is an iterative method.", true),
    ]),

    new Question("When design decisions are explicit and undocumented...", [
      new Answer("the architect is unaware of their decisions", false),
      new Answer("the architecture is probably not very good", false),
      new Answer("design knowledge vaporizes over time", true),
      new Answer("this is the preferred (but exceptional) situation", false),
    ]),

    new Question("Which of the following is or are examples of QUANTITATIVE design rationale?", [
      new Answer("Priority", true),
      new Answer("Implementation risk", true),
      new Answer("Design assumptions", false),
      new Answer("Design constraints", false),
    ]),

    new Question("Which of the following is or are characteristics of the design space?", [
      new Answer("The design space targets the concerns of a single stakeholder", false),
      new Answer("The design space consists of a single path among the possible alternatives", false),
      new Answer("Design options in the design space are independent", false),
      new Answer("The design space contains elements from the problem space and the solution space", true),
    ]),

    new Question("\"Availability percentage\" and \"Time to detect fault\" are good examples of response measures for a concrete QA scenario", [
      new Answer("Yes", false),
      new Answer("No", true),
    ]),

    new Question("\"99.99% uptime\", \"fault detected within 500msec\" and \"no interruption on weekdays 7am-10pm\" are good response measures for a concrete QA scenario", [
      new Answer("Yes", true),
      new Answer("No", false),
    ]),

    new Question("Which of the following statements about architectural tactics is/are CERTAINLY CORRECT?", [
      new Answer("Tactics always focus on a single quality attribute.", true),
      new Answer("Design patterns are packaged in architectural tactics.", false),
      new Answer("Selecting a tactic may lead to new design issues.", true),
      new Answer("Tactics address design trade-offs.", false),
    ]),

    new Question("'Active redundancy' means a redundant spare can take over from a failed component in a matter of msecs. This increases availability. It's an example of", [
      new Answer("a design pattern.", false),
      new Answer("a tactic.", true),
      new Answer("an architectural style.", false),
    ]),

    new Question("Which of the following statements about the ATAM is/are CERTAINLY CORRECT?", [
      new Answer("ATAM main outputs include articulation of rationale, risks and costs.", true),
      new Answer("ATAM main outputs include a set of risks and non-risks.", true),
      new Answer("The ATAM involves the architecture stakeholders.", true),
      new Answer("ATAM stands for Architectural Transition Analysis Method.", false),
    ]),

    new Question("Which of the following statements about the ATAM outputs is/are CERTAINLY CORRECT?", [
      new Answer("ATAM uncovers all architectural decisions.", false),
      new Answer("ATAM identifies nonrisks.", true),
      new Answer("ATAM identifies risks.", true),
      new Answer("ATAM provides a go/no-go decision.", false),
    ]),

    new Question("Select all statements below that are correct. In ATAM:", [
      new Answer("All sensitivity points are tradeoff points.", false),
      new Answer("All tradeoff points are sensitivity points.", true),
      new Answer("All risks are tradeoff points.", false),
      new Answer("Risks are distilled into risk themes.", true),
    ]),

    new Question("Which of the following statements about the notion of 'utility tree' are CERTAINLY CORRECT?", [
      new Answer("'Utility' is an expression of the overall 'goodness' of the quality attribute scenarios.", true),
      new Answer("The utility tree contains, among others, business goal scenarios and architecturally significant requirements.", false),
      new Answer("Architecturally significant requirements in a utility tree are usually expressed as quality attribute scenarios.", true),
      new Answer("The utility tree contains, among others, quality attributes and quality attribute refinements.", true),
    ]),

    new Question("Which of the following statements about architecture evaluation is/are CERTAINLY CORRECT?", [
      new Answer("You cannot use quantitative measures to evaluate an architecture, therefore you must use scenarios.", false),
      new Answer("ATAM is a scenario-based evaluation technique.", true),
      new Answer("Architecture evaluation can tell you which of two or more architectures is the most suitable.", true),
      new Answer("Architecture evaluation can be used to address the expected qualities of a system yet to be built.", true),
    ])
  ];
}
