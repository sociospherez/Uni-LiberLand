const certificateProgrammes = [
  {
    "slug": "excel",
    "title": "Spreadsheet Modelling Using Excel",
    "hours": 16,
    "level": "Beginner",
    "tag": "Business foundations",
    "overview": [
      "Build reliable spreadsheets, analyse business data and turn assumptions into clear, decision-ready models. Designed as a practical introduction for learners who use Excel but want to work with greater structure, confidence and accuracy.",
      "The programme follows a fictional independent retailer from raw sales records to a monthly margin report. You will practise separating inputs, calculations and outputs, making assumptions visible, and explaining what changes when an assumption changes."
    ],
    "audience": [
      "People who use spreadsheets at work but lack a consistent method",
      "Students and career changers starting business analysis",
      "Small-business owners planning sales and costs"
    ],
    "required": "No prior Excel knowledge. You should be able to manage files and use basic arithmetic.",
    "helpful": "Experience reading a simple business table.",
    "tools": "Microsoft Excel with XLOOKUP, tables, formulas and PivotTables. The browser sample runs without Excel; the programme exercises require access to the application.",
    "outcomes": [
      "Organise a workbook into inputs, calculations and outputs",
      "Use relative and absolute references correctly",
      "Clean and summarise a small sales table",
      "Build revenue, cost and margin calculations",
      "Compare a baseline with a changed assumption",
      "Present and check a clear business report"
    ],
    "modules": [
      {
        "title": "Spreadsheet foundations & model design",
        "hours": 2,
        "topics": "Workbook navigation; data types; tables; clear labels; input and output separation.",
        "exercise": "Create an inputs sheet and a structured sales table; identify three data-quality problems."
      },
      {
        "title": "Formulas & functions",
        "hours": 4,
        "topics": "Logical, lookup, aggregation and conditional functions; IF; SUMIFS/COUNTIFS; XLOOKUP; error handling; formula auditing.",
        "exercise": "Calculate line totals, apply a fixed rate, and copy formulas safely across a table."
      },
      {
        "title": "Data preparation & analysis",
        "hours": 3,
        "topics": "Excel Tables; data validation; cleaning, sorting and filtering; PivotTables; data quality checks.",
        "exercise": "Clean the retailer records and reconcile category totals against overall sales."
      },
      {
        "title": "Business modelling",
        "hours": 3,
        "topics": "Assumptions; scenario comparison; sensitivity thinking; break-even example.",
        "exercise": "Compare baseline and lower-volume scenarios and explain the effect on profit."
      },
      {
        "title": "Visualisation & reporting",
        "hours": 2,
        "topics": "Charts; conditional formatting; KPI summary; presentation principles.",
        "exercise": "Produce a one-page monthly report with one chart and three findings."
      },
      {
        "title": "Practical project & assessment",
        "hours": 2,
        "topics": "Model audit; reconciliation; documentation; project submission and reflection.",
        "exercise": "Submit a checked workbook and a short recommendation for the retailer."
      }
    ],
    "project": "Build a simple 12-month business planning model using supplied revenue and cost assumptions.",
    "deliverables": [
      "A structured workbook with inputs, monthly calculations and clearly labelled assumptions",
      "A baseline and alternative scenario with checked revenue, cost and profit totals",
      "A one-page summary explaining the key results and one limitation"
    ],
    "rubric": [
      "Formula accuracy and reconciliation — 40%",
      "Model structure and scenario logic — 30%",
      "Clarity, documentation and recommendation — 30%"
    ],
    "lesson": {
      "module": "02 · Formulas & functions",
      "title": "2.2 — When should a reference stay fixed?",
      "minutes": 12,
      "learn": "A relative reference moves when you copy a formula. An absolute reference stays fixed. Put a shared assumption in one labelled cell and lock its row and column with dollar signs. This makes the assumption easy to change without editing every formula.",
      "example": "B2 contains a net amount of 100. E1 contains a service rate of 0.20. In C2, =B2*$E$1 returns 20. Copy it to C3 and it becomes =B3*$E$1: the amount changes row, but the rate stays in E1.",
      "prompt": "B3 contains 150 and E1 contains 0.20. Which formula correctly calculates the service amount in C3 and can safely be copied down?",
      "choices": [
        "=B3*E1",
        "=B3*$E$1",
        "=$B$3*E1"
      ],
      "correct": 1,
      "feedback": [
        "E1 is relative, so it will move to E2 when you copy down. Lock the shared rate.",
        "Correct. B3 follows each sales row while $E$1 stays fixed. The result here is 30.",
        "This locks the sales amount instead of the shared rate. Each row needs its own amount."
      ],
      "transfer": "Change the rate in E1 to 0.25. Every correctly linked row updates; the amount for B3 becomes 37.50. In Excel, test both the rate change and a copied formula.",
      "next": "Next in the full programme: use IF to flag a margin below target."
    },
    "file": "excel-certificate-demo.html"
  },
  {
    "slug": "forecasting",
    "title": "Time Series Forecasting",
    "hours": 24,
    "level": "Intermediate",
    "tag": "Predictive analytics",
    "overview": [
      "Learn to forecast a quantity that changes over time and judge whether the forecast is useful. Work with monthly demand, identify patterns, and compare a simple baseline with more structured methods.",
      "The emphasis is on honest evaluation: preserve time order, avoid using future information, and explain uncertainty. This is an introductory forecasting workflow rather than a promise of reliable predictions for every dataset."
    ],
    "audience": [
      "Analysts planning demand, staffing or inventory",
      "Operations staff moving beyond spreadsheet trend lines",
      "Learners comfortable with basic Python data analysis"
    ],
    "required": "Basic Python and pandas, charts, averages and variability. Complete the Python certificate or demonstrate equivalent skills.",
    "helpful": "Familiarity with business planning and elementary statistics.",
    "tools": "Python notebook environment with pandas, matplotlib and statsmodels; CSV files. No paid forecasting service required.",
    "outcomes": [
      "Recognise trend, seasonality and missing periods",
      "Create naive and seasonal-naive baselines",
      "Split a series chronologically for evaluation",
      "Compare smoothing and introductory ARIMA models",
      "Measure error and interpret forecast intervals",
      "Communicate a forecast with assumptions and limits"
    ],
    "modules": [
      {
        "title": "Time series foundations",
        "hours": 3,
        "topics": "Time indexes; frequency; trend; seasonality; demand versus sales.",
        "exercise": "Plot monthly demand and annotate recurring peaks and missing periods."
      },
      {
        "title": "Preparing chronological data",
        "hours": 3,
        "topics": "Resampling; missing dates; aggregation; outliers; leakage prevention.",
        "exercise": "Create a regular monthly index and document a defensible treatment of gaps."
      },
      {
        "title": "Baselines & backtesting",
        "hours": 4,
        "topics": "Naive forecasts; seasonal naive; chronological holdouts; rolling origins; MAE.",
        "exercise": "Compare two baselines on a held-out period without shuffling dates."
      },
      {
        "title": "Forecasting methods",
        "hours": 5,
        "topics": "Moving averages; exponential smoothing; introductory stationarity and ARIMA concepts.",
        "exercise": "Fit a smoothing model and a simple ARIMA candidate; compare against the baseline."
      },
      {
        "title": "Uncertainty & model diagnosis",
        "hours": 4,
        "topics": "Residual patterns; forecast intervals; horizon-specific error; intermittent demand limitations.",
        "exercise": "Inspect errors and explain why uncertainty grows or changes across the horizon."
      },
      {
        "title": "Demand forecast project",
        "hours": 5,
        "topics": "Model selection; reproducible workflow; forecast presentation; assessment.",
        "exercise": "Submit a forecast, backtest results and a decision-focused planning note."
      }
    ],
    "project": "Demand planning brief: prepare a three-month forecast for a fictional retailer using an extended monthly series.",
    "deliverables": [
      "A notebook showing preparation, chronological evaluation and at least two baselines",
      "One candidate model compared with the strongest baseline using MAE",
      "A three-month forecast with uncertainty discussion and a one-page planning recommendation"
    ],
    "rubric": [
      "Data preparation and leakage-free evaluation — 35%",
      "Model comparison and error analysis — 40%",
      "Reproducibility and communication — 25%"
    ],
    "lesson": {
      "module": "03 · Baselines & backtesting",
      "title": "3.2 — Can your forecast beat yesterday?",
      "minutes": 15,
      "learn": "A baseline is a deliberately simple forecast that gives your model something to beat. A naive forecast repeats the last observed value. Evaluate predictions on later observations, keeping those values hidden during model fitting. Mean absolute error (MAE) averages the size of the errors.",
      "example": "The last training observation is 100. A fixed-origin naive forecast for the next three months is [100, 100, 100]. The actual values are [110, 90, 120]. Absolute errors are [10, 10, 20], so MAE is 40 / 3 = 13.33 units.",
      "prompt": "A candidate model has MAE 16 on exactly the same holdout. Which conclusion is supported?",
      "choices": [
        "The candidate is better because it is more complex",
        "The naive baseline has lower average error on this holdout",
        "Shuffle the dates until the candidate wins"
      ],
      "correct": 1,
      "feedback": [
        "Complexity does not establish usefulness. Compare errors on the same unseen periods.",
        "Correct. 13.33 is lower than 16. Keep the baseline as the reference and investigate other time windows.",
        "Shuffling breaks the forecasting setting and can leak future information."
      ],
      "transfer": "A single holdout is limited evidence. Repeat the comparison at several chronological forecast origins before choosing a model.",
      "next": "Next in the full programme: compare a seasonal-naive forecast against the same horizon."
    },
    "file": "forecasting-certificate-demo.html"
  },
  {
    "slug": "social-media",
    "title": "Social Media Analytics",
    "hours": 24,
    "level": "Beginner",
    "tag": "Marketing intelligence",
    "overview": [
      "Turn social media activity into a clear account of what an organisation is achieving. Start with the business question, select meaningful measures, and compare content without mistaking a large audience for strong performance.",
      "Use fictional campaign exports to practise data cleaning, audience and content analysis, simple experiment design and reporting. Distinguish observed association from evidence of causal impact."
    ],
    "audience": [
      "Marketing coordinators and content creators",
      "Small-business owners reviewing campaigns",
      "Learners entering digital marketing analysis"
    ],
    "required": "Basic spreadsheet use, percentages and the ability to read a chart. No coding required.",
    "helpful": "Experience planning or publishing social content.",
    "tools": "Excel or another spreadsheet application; supplied fictional exports. A live social account or API is unnecessary.",
    "outcomes": [
      "Translate campaign goals into measurable questions",
      "Define engagement and conversion metrics consistently",
      "Clean and compare campaign exports",
      "Analyse content and audience segments responsibly",
      "Design a simple test with a stated success measure",
      "Present recommendations with attribution limitations"
    ],
    "modules": [
      {
        "title": "Goals & measurement",
        "hours": 3,
        "topics": "Awareness versus action; metric definitions; campaign objectives; measurement plans.",
        "exercise": "Write a measurement plan for a fictional event campaign."
      },
      {
        "title": "Data collection & quality",
        "hours": 4,
        "topics": "Export structures; date windows; missing values; duplicate posts; ethical collection.",
        "exercise": "Clean a mixed campaign export and create a metric dictionary."
      },
      {
        "title": "Audience & content analysis",
        "hours": 4,
        "topics": "Content categories; segmentation; rates versus totals; reach and impressions.",
        "exercise": "Compare formats using a consistent denominator and report sample sizes."
      },
      {
        "title": "Campaign performance",
        "hours": 4,
        "topics": "Engagement rate; click-through rate; conversion rate; tagged links; attribution limits.",
        "exercise": "Build a campaign summary that separates engagement from website outcomes."
      },
      {
        "title": "Experiments & interpretation",
        "hours": 4,
        "topics": "Test hypotheses; random assignment concepts; confounders; sentiment sampling and coding.",
        "exercise": "Draft a two-variant content test and manually code a small fictional comment set."
      },
      {
        "title": "Campaign insight project",
        "hours": 5,
        "topics": "Dashboard; evidence hierarchy; recommendations; assessment.",
        "exercise": "Deliver a campaign review and a proposed follow-up experiment."
      }
    ],
    "project": "Campaign review: decide which content formats deserve a follow-up test for a fictional university open day.",
    "deliverables": [
      "A cleaned export and metric dictionary with explicit denominators",
      "A compact report comparing formats and campaign objectives",
      "Three evidence-linked recommendations and a test plan with limitations"
    ],
    "rubric": [
      "Metric definitions and data quality — 35%",
      "Analysis and interpretation — 35%",
      "Recommendations, ethics and test design — 30%"
    ],
    "lesson": {
      "module": "03 · Audience & content analysis",
      "title": "3.1 — Which post really performed better?",
      "minutes": 10,
      "learn": "Totals and rates answer different questions. Total engagements describe volume. Engagements divided by impressions describe engagements per display, not the proportion of unique people who engaged. Always name the denominator and keep the definition consistent between posts.",
      "example": "Post A has 120 engagements from 4,000 impressions: 120 / 4,000 × 100 = 3%. Post B has 80 engagements from 1,000 impressions: 8%. A has more engagements in total; B has the higher rate.",
      "prompt": "Your stated goal is the higher engagement rate per impression. Which post leads?",
      "choices": [
        "Post A, because 120 exceeds 80",
        "Post B, at 8%",
        "Both, because impressions measure unique people"
      ],
      "correct": 1,
      "feedback": [
        "That answers the volume question. The stated goal asks for the rate.",
        "Correct. B has the higher rate; A still generated more engagements overall. Neither result establishes conversions or causal impact.",
        "Impressions can include repeated displays to the same person. They are not unique reach."
      ],
      "transfer": "Before recommending B, inspect the campaign objective, audience, spend and sample size. A useful report can show both the rate and total.",
      "next": "Next in the full programme: connect campaign clicks to a separately defined conversion measure."
    },
    "file": "social-media-certificate-demo.html"
  },
  {
    "slug": "python",
    "title": "Programming for Data Analytics Using Python",
    "hours": 24,
    "level": "Beginner",
    "tag": "Programming foundations",
    "overview": [
      "Learn enough Python to turn a small dataset into a reproducible analysis. Build confidence with variables, functions and errors before working with tables and charts.",
      "Follow a fictional sales investigation from a CSV file to an explained result. Short coding exercises lead to a notebook that someone else can rerun, with assumptions and checks visible."
    ],
    "audience": [
      "First-time programmers interested in data",
      "Spreadsheet users wanting repeatable analysis",
      "Students preparing for more technical certificates"
    ],
    "required": "No programming experience. Basic arithmetic, file management and access to a computer.",
    "helpful": "Familiarity with tables and spreadsheet formulas.",
    "tools": "Python 3 notebook environment with pandas and matplotlib, locally installed or institution-provided.",
    "outcomes": [
      "Use variables, types, conditions and loops",
      "Write and call a small function",
      "Read an error message and isolate its cause",
      "Load, filter and summarise tabular data",
      "Handle missing values with an explicit rationale",
      "Create a reproducible notebook with charts and conclusions"
    ],
    "modules": [
      {
        "title": "Getting started",
        "hours": 3,
        "topics": "Notebook cells; variables; types; arithmetic; running cells in order.",
        "exercise": "Calculate order revenue and annotate the assumptions."
      },
      {
        "title": "Programming building blocks",
        "hours": 4,
        "topics": "Lists; dictionaries; conditions; loops; functions.",
        "exercise": "Write a reusable function that calculates a discounted price."
      },
      {
        "title": "Working with data",
        "hours": 4,
        "topics": "CSV input; DataFrames; selecting columns; filtering; grouping.",
        "exercise": "Summarise sales by region and inspect the intermediate tables."
      },
      {
        "title": "Cleaning & debugging",
        "hours": 4,
        "topics": "Missing values; data types; duplicates; exceptions; assertions.",
        "exercise": "Repair an inconsistent sales table and add checks for impossible values."
      },
      {
        "title": "Exploration & communication",
        "hours": 4,
        "topics": "Descriptive summaries; chart selection; labels; correlation limits.",
        "exercise": "Create two charts and distinguish observations from explanations."
      },
      {
        "title": "Reproducible analysis project",
        "hours": 5,
        "topics": "Notebook narrative; functions; restart-and-run validation; assessment.",
        "exercise": "Deliver a rerunnable sales analysis with documented decisions."
      }
    ],
    "project": "Sales investigation: explain differences in regional order values using a reproducible notebook.",
    "deliverables": [
      "A notebook with imports, data loading, cleaning decisions and reusable logic",
      "Regional summaries and two clearly labelled charts",
      "A short findings section with checks, caveats and rerun instructions"
    ],
    "rubric": [
      "Code correctness and data handling — 40%",
      "Analysis and visual explanation — 30%",
      "Reproducibility and documentation — 30%"
    ],
    "lesson": {
      "module": "04 · Cleaning & debugging",
      "title": "4.1 — Missing is not the same as zero",
      "minutes": 12,
      "learn": "A missing value means that a value is unknown or absent. Zero is a known quantity. Replacing missing values with zero can distort an average. Inspect the meaning of a column and record how many values were missing before deciding what to do.",
      "example": "Order values are [20, missing, 40]. For this example, report the average of known values: (20 + 40) / 2 = 30. In pandas: sales[\"amount\"].mean(). Also report sales[\"amount\"].isna().sum(), which is 1. This is not proof that the missing order was typical.",
      "prompt": "If you replace the missing amount with zero, what average do you get?",
      "choices": [
        "20",
        "30",
        "60"
      ],
      "correct": 0,
      "feedback": [
        "Correct. (20 + 0 + 40) / 3 = 20. The replacement changes the result, so it requires a defensible reason.",
        "30 is the mean of the two known values, excluding the missing observation.",
        "60 is the sum of known values, not their mean."
      ],
      "transfer": "The CSV leaves the missing amount blank. Compare the mean before and after fillna(0), then write one sentence explaining which interpretation fits the business question.",
      "next": "Next in the full programme: validate numeric types before grouping sales by region."
    },
    "file": "python-certificate-demo.html"
  },
  {
    "slug": "power-bi",
    "title": "Dashboarding & Storytelling Using Power BI",
    "hours": 24,
    "level": "Foundation",
    "tag": "Visual analytics",
    "overview": [
      "Create a report that helps a reader make a decision. Prepare business data, build a sensible model, define measures and arrange visuals around a clear question.",
      "Work towards a fictional retail performance dashboard. The focus is reliable calculations and understandable stories, with attention to filters, accessibility and the difference between a report page and a recommendation."
    ],
    "audience": [
      "Spreadsheet analysts moving into dashboards",
      "Managers producing recurring performance reports",
      "Learners interested in business intelligence"
    ],
    "required": "Confidence with spreadsheet tables, percentages and basic charts. No DAX experience required.",
    "helpful": "Familiarity with relationships between orders, products and customers.",
    "tools": "Power BI Desktop on a compatible Windows computer. The browser sample needs no installation; sharing-service permissions are outside the demo.",
    "outcomes": [
      "Prepare data using repeatable transformations",
      "Model related tables at a clear level of detail",
      "Create basic measures and explain filter context",
      "Select visuals that answer a business question",
      "Build an accessible, coherent report journey",
      "Validate totals and present a decision-focused story"
    ],
    "modules": [
      {
        "title": "Questions & report planning",
        "hours": 2,
        "topics": "Audience; decisions; KPI definitions; page sketches.",
        "exercise": "Sketch a report answering where margin is falling."
      },
      {
        "title": "Data preparation",
        "hours": 4,
        "topics": "Power Query steps; types; missing values; merging and appending.",
        "exercise": "Prepare orders and products while preserving a traceable transformation sequence."
      },
      {
        "title": "Modelling & relationships",
        "hours": 4,
        "topics": "Fact and dimension tables; keys; grain; relationship direction; date table concepts.",
        "exercise": "Create a small star model and check that joins do not duplicate sales."
      },
      {
        "title": "Measures & filter context",
        "hours": 5,
        "topics": "Measures versus columns; SUM; DIVIDE; CALCULATE introduction; filter effects.",
        "exercise": "Build revenue, margin and margin-rate measures and reconcile them to source totals."
      },
      {
        "title": "Visual storytelling",
        "hours": 4,
        "topics": "Visual selection; hierarchy; slicers; accessible colour; tooltips; narrative.",
        "exercise": "Create overview and detail pages that guide a reader from finding to evidence."
      },
      {
        "title": "Dashboard project & validation",
        "hours": 5,
        "topics": "Report testing; annotated findings; delivery and assessment.",
        "exercise": "Submit a validated report and a short walkthrough of the business decision."
      }
    ],
    "project": "Retail performance story: identify which region warrants a margin investigation.",
    "deliverables": [
      "A report file with a documented model and repeatable preparation steps",
      "Measures, an overview page and a supporting detail page",
      "A validation checklist and a three-minute walkthrough script"
    ],
    "rubric": [
      "Data model and measure accuracy — 40%",
      "Report usability and accessibility — 30%",
      "Evidence, validation and narrative — 30%"
    ],
    "lesson": {
      "module": "04 · Measures & filter context",
      "title": "4.2 — Why averaging percentages can mislead",
      "minutes": 14,
      "learn": "To show overall margin rate, divide total margin by total revenue. Averaging row percentages gives each row equal influence, even when the revenues differ. Define a measure that responds to the selected data while keeping the business meaning intact.",
      "example": "North: revenue 100, margin 20 (20%). South: revenue 900, margin 90 (10%). Total margin rate = 110 / 1,000 = 11%. A simple average of the regional percentages is 15%, which is not the overall margin rate. Example measure: Margin Rate = DIVIDE(SUM(Sales[Margin]), SUM(Sales[Revenue])).",
      "prompt": "What should the overall margin-rate card show when both regions are selected?",
      "choices": [
        "15%",
        "30%",
        "11%"
      ],
      "correct": 2,
      "feedback": [
        "15% averages the two rates without considering their different revenues.",
        "Adding percentages does not produce the combined rate.",
        "Correct. Divide total margin 110 by total revenue 1,000. Format the measure as a percentage."
      ],
      "transfer": "Filter to North only: the same ratio-of-totals measure becomes 20%. This is an example of filter context changing the rows included in the calculation.",
      "next": "Next in the full programme: test a measure under region and date filters."
    },
    "file": "power-bi-certificate-demo.html"
  },
  {
    "slug": "databases",
    "title": "Database Management Using SQL & MongoDB",
    "hours": 24,
    "level": "Foundation",
    "tag": "Data systems",
    "overview": [
      "Learn how structured and document databases store business information, and choose a suitable representation for a simple application. Practise querying, joining and aggregating data while preserving its meaning.",
      "The programme compares SQL tables and MongoDB documents through a small order-management case. It introduces safe updates, validation and basic access control; it is a foundation in database use rather than advanced database administration."
    ],
    "audience": [
      "Analysts who need to retrieve their own data",
      "Junior developers learning persistence",
      "Learners preparing for data engineering"
    ],
    "required": "Comfort with tables, identifiers and logical conditions. No prior database programming required.",
    "helpful": "Basic scripting or spreadsheet lookup experience.",
    "tools": "A local SQL practice database such as SQLite and a MongoDB practice environment with a query shell. Use disposable sample data.",
    "outcomes": [
      "Design tables with keys and sensible relationships",
      "Retrieve and aggregate records using SQL",
      "Explain how joins affect row counts",
      "Model and query simple MongoDB documents",
      "Choose embedding or references for a stated use case",
      "Apply basic validation, safe-change and access principles"
    ],
    "modules": [
      {
        "title": "Data models & integrity",
        "hours": 3,
        "topics": "Entities; keys; one-to-many relationships; constraints; normalisation basics.",
        "exercise": "Model customers, orders and order lines with explicit keys."
      },
      {
        "title": "SQL queries",
        "hours": 5,
        "topics": "SELECT; WHERE; ORDER BY; NULL; GROUP BY; aggregate functions.",
        "exercise": "Answer five order questions and check the treatment of missing values."
      },
      {
        "title": "Joins & safe changes",
        "hours": 4,
        "topics": "INNER and LEFT joins; duplication; INSERT and UPDATE; transaction concepts.",
        "exercise": "Join orders to lines, reconcile totals and rehearse a change in a practice database."
      },
      {
        "title": "MongoDB documents",
        "hours": 4,
        "topics": "Collections; document shape; nested fields; find; projections; updates.",
        "exercise": "Represent an order as a document and query its nested delivery details."
      },
      {
        "title": "Aggregation & design choices",
        "hours": 3,
        "topics": "Aggregation pipelines; embedding versus references; index concepts; validation and access.",
        "exercise": "Aggregate document orders and justify one modelling decision."
      },
      {
        "title": "Dual-model project",
        "hours": 5,
        "topics": "Equivalent queries; integrity checks; documentation; assessment.",
        "exercise": "Deliver relational and document versions of the order case with query results."
      }
    ],
    "project": "Order-system comparison: answer the same business questions from tables and documents.",
    "deliverables": [
      "A relational schema with sample records and five checked SQL queries",
      "Equivalent MongoDB documents and two aggregation/query examples",
      "A design note covering keys, duplication, safe changes and access"
    ],
    "rubric": [
      "Query accuracy and validation — 40%",
      "Data modelling and integrity — 35%",
      "Design rationale and documentation — 25%"
    ],
    "lesson": {
      "module": "03 · Joins & safe changes",
      "title": "3.1 — Why did the total double?",
      "minutes": 15,
      "learn": "A join returns matching combinations of rows. If an order has two lines, joining the order header to those lines produces two rows. Summing a header-level total after that join counts the same order twice. Identify the grain: what does one row represent?",
      "example": "Order 101 has an order_total of 100 and two lines worth 40 and 60. SELECT SUM(o.order_total) FROM orders o JOIN lines l ON o.order_id = l.order_id returns 200 for this example. Summing the line values returns 100, as does summing the unjoined order table.",
      "prompt": "You need revenue across all orders. Which approach is sound for this model?",
      "choices": [
        "Sum order_total in the orders table before joining lines",
        "Use SUM(DISTINCT order_total) for every business dataset",
        "Add more joins until the duplicate rows disappear"
      ],
      "correct": 0,
      "feedback": [
        "Correct. Preserve the order grain. If you need line-level analysis, aggregate the appropriate line amounts instead.",
        "Different orders can have the same total. DISTINCT can incorrectly collapse their values.",
        "More joins can introduce further duplication. Check the grain and relationships first."
      ],
      "transfer": "Before and after any join, compare row counts, distinct order IDs and reconciled totals. Repetition may be valid at the line grain but invalid for summing order headers.",
      "next": "Next in the full programme: preserve customers with no orders using a LEFT JOIN."
    },
    "file": "databases-certificate-demo.html"
  },
  {
    "slug": "ai-deep-learning",
    "title": "Artificial Intelligence & Deep Learning Using Python",
    "hours": 40,
    "level": "Intermediate",
    "tag": "Machine learning",
    "overview": [
      "Build and evaluate a small supervised learning system, then explore how a neural network learns from data. Begin with a simple baseline so that added complexity has a clear purpose.",
      "Use manageable tabular and image examples to study preprocessing, training, validation and error analysis. The programme emphasises leakage prevention, responsible use and honest reporting; it does not qualify a model for high-stakes deployment."
    ],
    "audience": [
      "Python-capable analysts beginning machine learning",
      "Developers exploring neural networks",
      "Learners ready to connect statistics with practical modelling"
    ],
    "required": "Python functions, pandas and NumPy basics; averages, probability concepts and basic algebra. The beginner Python certificate alone may need additional practice.",
    "helpful": "Vectors, derivatives and prior train/test split experience.",
    "tools": "Python notebooks with NumPy, pandas, scikit-learn and an instructor-selected neural-network framework. Small CPU-friendly exercises; no paid GPU required for the demo scope.",
    "outcomes": [
      "Define a supervised learning task and baseline",
      "Separate training, validation and test data",
      "Fit preprocessing without leaking held-out information",
      "Train a small neural network and interpret learning curves",
      "Select metrics appropriate to class balance and error costs",
      "Document model limitations and responsible-use boundaries"
    ],
    "modules": [
      {
        "title": "Problem framing & AI foundations",
        "hours": 3,
        "topics": "Prediction versus explanation; supervised tasks; error costs; responsible use.",
        "exercise": "Write a model brief identifying the decision, target and unacceptable errors."
      },
      {
        "title": "Data preparation & splits",
        "hours": 5,
        "topics": "Features and labels; scaling; encoding; split strategy; leakage.",
        "exercise": "Create a preprocessing pipeline fitted only on training data."
      },
      {
        "title": "Classical baselines",
        "hours": 5,
        "topics": "Dummy predictors; logistic regression; trees; cross-validation concepts.",
        "exercise": "Compare a simple learned model with a dummy baseline."
      },
      {
        "title": "Neural-network foundations",
        "hours": 5,
        "topics": "Weights; activations; loss; gradient descent; batches; epochs.",
        "exercise": "Trace a tiny forward calculation and explain a loss curve."
      },
      {
        "title": "Training small networks",
        "hours": 6,
        "topics": "Dense networks; optimisers; validation; learning rates; reproducibility.",
        "exercise": "Train a small classifier and record its training configuration."
      },
      {
        "title": "Generalisation & diagnosis",
        "hours": 5,
        "topics": "Overfitting; regularisation; early stopping; confusion matrix; class imbalance.",
        "exercise": "Diagnose learning curves and compare precision and recall."
      },
      {
        "title": "Deep-learning applications & responsibility",
        "hours": 4,
        "topics": "Introductory image classification; transfer learning concepts; bias; privacy; model cards.",
        "exercise": "Inspect error examples and draft a restricted-use model card."
      },
      {
        "title": "Model comparison project",
        "hours": 7,
        "topics": "Reproducible evaluation; held-out test; error analysis; assessment.",
        "exercise": "Submit a baseline/network comparison and an evidence-based recommendation."
      }
    ],
    "project": "Classifier comparison: determine whether a small neural network improves on a simple baseline for a low-risk labelled dataset.",
    "deliverables": [
      "A reproducible notebook with a justified split and leakage-safe preprocessing",
      "Baseline and network metrics, learning curves and error examples",
      "A model card covering intended use, class balance, limitations and reproducibility"
    ],
    "rubric": [
      "Evaluation design and leakage prevention — 35%",
      "Implementation and diagnostic analysis — 40%",
      "Responsible-use documentation and clarity — 25%"
    ],
    "lesson": {
      "module": "06 · Generalisation & diagnosis",
      "title": "6.2 — When 95% accuracy tells the wrong story",
      "minutes": 15,
      "learn": "Accuracy is the proportion of all predictions that are correct. It can conceal complete failure on a rare class. Recall for the positive class is true positives divided by all actual positives. Choose metrics based on what the errors mean.",
      "example": "A test set has 95 negative cases and 5 positive cases. A model predicts negative for everyone. It is correct on 95 of 100 cases, so accuracy is 95%. It finds zero of the five positives, so positive-class recall is 0%.",
      "prompt": "What is the model’s positive-class recall?",
      "choices": [
        "95%",
        "5%",
        "0%"
      ],
      "correct": 2,
      "feedback": [
        "That is the overall accuracy, dominated by the negative class.",
        "5% is the prevalence of positive cases, not recall.",
        "Correct. Recall = 0 / 5 = 0%. The model misses every actual positive."
      ],
      "transfer": "Positive precision has a zero denominator here because no positives were predicted. Report that explicitly rather than presenting it as evidence of strong performance. Inspect the confusion matrix alongside accuracy.",
      "next": "Next in the full programme: compare decision thresholds and their precision–recall trade-off."
    },
    "file": "ai-deep-learning-certificate-demo.html"
  },
  {
    "slug": "business-analytics",
    "title": "Business Analytics Professional",
    "hours": 50,
    "level": "Foundation to intermediate",
    "tag": "Business decisions",
    "overview": [
      "Move from an ambiguous business problem to a defensible recommendation. Combine data quality, descriptive analysis, basic statistical reasoning, forecasting and decision modelling in one applied workflow.",
      "The longer format allows several linked case exercises and a substantial capstone. The word Professional identifies the programme title; the proposed award is a certificate of completion, not a professional licence or externally accredited designation."
    ],
    "audience": [
      "Business professionals taking on analytical responsibilities",
      "Analysts who want a stronger decision-making framework",
      "Career changers with spreadsheet experience"
    ],
    "required": "Confident spreadsheet use, formulas, charts and percentages. Prior completion of the Excel certificate or equivalent experience.",
    "helpful": "Exposure to business operations and introductory statistics.",
    "tools": "A spreadsheet application for core work; optional SQL or Power BI for learners with prior experience. No coding requirement.",
    "outcomes": [
      "Turn a business issue into a scoped analytical brief",
      "Define KPIs and assess data fitness",
      "Use descriptive statistics and visual analysis",
      "Interpret uncertainty and distinguish correlation from causation",
      "Compare forecasting and scenario-based decision options",
      "Deliver a supported recommendation with an implementation measure"
    ],
    "modules": [
      {
        "title": "Business framing",
        "hours": 4,
        "topics": "Stakeholders; problem statements; decision criteria; scope.",
        "exercise": "Write an analytical brief for a retailer with declining profit."
      },
      {
        "title": "Data literacy & governance",
        "hours": 4,
        "topics": "Sources; definitions; access; privacy; bias; data-quality checks.",
        "exercise": "Create a data dictionary and a quality-risk register."
      },
      {
        "title": "Preparation & exploration",
        "hours": 5,
        "topics": "Cleaning; joins conceptually; aggregation; distributions; outliers.",
        "exercise": "Build a reproducible analysis table and an exploration log."
      },
      {
        "title": "KPIs & visual analysis",
        "hours": 5,
        "topics": "Metric trees; segmentation; leading and lagging indicators; visual selection.",
        "exercise": "Decompose profit by region, product and period."
      },
      {
        "title": "Statistics for decisions",
        "hours": 5,
        "topics": "Sampling; variation; confidence intervals conceptually; correlation.",
        "exercise": "Explain uncertainty in an estimated customer average without claiming causation."
      },
      {
        "title": "Experiments & causal caution",
        "hours": 4,
        "topics": "Hypotheses; comparison groups; randomisation; confounders; practical significance.",
        "exercise": "Design a pricing test with a primary outcome and guardrail."
      },
      {
        "title": "Forecasting & planning",
        "hours": 5,
        "topics": "Naive baselines; seasonality; holdouts; forecast error; planning assumptions.",
        "exercise": "Evaluate a simple demand forecast and explain planning implications."
      },
      {
        "title": "Decision & scenario modelling",
        "hours": 5,
        "topics": "Contribution margin; break-even; sensitivity; constrained choices.",
        "exercise": "Compare two operating options and test the assumption that could reverse the choice."
      },
      {
        "title": "Stakeholder storytelling",
        "hours": 4,
        "topics": "Executive summaries; evidence chains; visual narrative; implementation metrics.",
        "exercise": "Prepare a five-slide recommendation and respond to a stakeholder objection."
      },
      {
        "title": "Integrated business capstone",
        "hours": 9,
        "topics": "Integrated analysis; validation; recommendation; review and assessment.",
        "exercise": "Submit a decision brief, supporting model and implementation measurement plan."
      }
    ],
    "project": "Retail recovery plan: recommend one intervention to improve contribution while protecting customer outcomes.",
    "deliverables": [
      "A scoped brief, data dictionary and checked analytical model",
      "An option comparison with sensitivity analysis and uncertainty discussion",
      "A five-slide executive story and a measurement plan with named decision criteria"
    ],
    "rubric": [
      "Problem framing and data fitness — 20%",
      "Analytical correctness and option comparison — 40%",
      "Recommendation and implementation measures — 25%",
      "Communication and limitations — 15%"
    ],
    "lesson": {
      "module": "08 · Decision & scenario modelling",
      "title": "8.1 — Revenue is not contribution",
      "minutes": 15,
      "learn": "Contribution equals revenue minus variable costs. A larger sales figure can hide a weaker economic result. Compare options against the decision’s stated objective, then examine capacity, uncertainty and any fixed-cost differences before making a recommendation.",
      "example": "Option A sells 100 units at 50, with variable cost 30 per unit. Contribution = 100 × (50 − 30) = 2,000. Option B sells 140 units at 45, with variable cost 32. Contribution = 140 × 13 = 1,820. Fixed costs are equal in this example.",
      "prompt": "With contribution as the criterion and all other factors held equal, which option leads?",
      "choices": [
        "A, by 180",
        "B, because it generates more revenue",
        "They are equal because fixed costs are equal"
      ],
      "correct": 0,
      "feedback": [
        "Correct. A contributes 2,000 versus 1,820. This is a conditional comparison, not a complete investment decision.",
        "B has revenue 6,300 versus 5,000, but its lower unit contribution produces a lower total contribution.",
        "Equal fixed costs do not make different contribution totals equal."
      ],
      "transfer": "At a unit contribution of 13, B needs more than 2,000 / 13 = 153.85 units to exceed A. For whole units, that means at least 154. Test whether this volume is plausible.",
      "next": "Next in the full programme: add a capacity constraint and document what changes the recommendation."
    },
    "file": "business-analytics-certificate-demo.html"
  },
  {
    "slug": "data-engineering",
    "title": "Applied Data Engineering",
    "hours": 60,
    "level": "Intermediate",
    "tag": "Data infrastructure",
    "overview": [
      "Build a small, dependable data pipeline from ingestion to an analytical output. Learn to make data contracts explicit, detect bad records, rerun work safely and explain how the system behaves when something fails.",
      "The programme uses a local batch pipeline to keep the operational concepts visible. It introduces orchestration, warehouse modelling and event processing without assuming a production cloud subscription or presenting a small lab as a production platform."
    ],
    "audience": [
      "Python and SQL users progressing into data engineering",
      "Analysts maintaining repeatable data workflows",
      "Junior developers working with analytical datasets"
    ],
    "required": "Working Python, file I/O, functions and SQL joins/grouping; basic command-line use. Complete the Python and database certificates plus independent practice, or demonstrate equivalent experience.",
    "helpful": "Git, virtual environments and basic relational modelling.",
    "tools": "Python, a local analytical SQL database and a local workflow scheduler selected for teaching. Files and simulated API responses; no paid cloud account required.",
    "outcomes": [
      "Define source contracts and target table grain",
      "Build incremental batch ingestion with validation",
      "Transform raw records into useful analytical tables",
      "Design idempotent loads and handle late updates",
      "Schedule, monitor and recover a small workflow",
      "Document security, lineage and operational limits"
    ],
    "modules": [
      {
        "title": "Architecture & contracts",
        "hours": 4,
        "topics": "Sources; consumers; batch versus events; schema contracts; system boundaries.",
        "exercise": "Draw a pipeline and define required fields and ownership."
      },
      {
        "title": "Python ingestion",
        "hours": 6,
        "topics": "CSV and JSON; API concepts; pagination; retries; raw storage.",
        "exercise": "Ingest simulated paginated responses while preserving raw records."
      },
      {
        "title": "SQL transformations",
        "hours": 6,
        "topics": "Staging; joins; aggregation; window-function concepts; grain.",
        "exercise": "Transform order events into a checked daily sales table."
      },
      {
        "title": "Analytical data modelling",
        "hours": 6,
        "topics": "Facts and dimensions; surrogate keys; changing attributes; warehouse layers.",
        "exercise": "Model an order fact and customer dimension with documented keys."
      },
      {
        "title": "Data quality & testing",
        "hours": 6,
        "topics": "Schema checks; nulls; uniqueness; referential integrity; quarantine.",
        "exercise": "Reject or quarantine malformed records and reconcile accepted totals."
      },
      {
        "title": "Incremental loads & idempotency",
        "hours": 6,
        "topics": "Watermarks; upserts; deduplication; late data; replay.",
        "exercise": "Rerun an incremental batch without creating duplicate orders."
      },
      {
        "title": "Orchestration & recovery",
        "hours": 6,
        "topics": "Task dependencies; scheduling; retries; backfills; failure isolation.",
        "exercise": "Create a local workflow and recover from an intentionally failed task."
      },
      {
        "title": "Observability & secure operation",
        "hours": 5,
        "topics": "Logs; freshness; row counts; alerts; least privilege; secrets handling.",
        "exercise": "Produce a run summary and a response guide for a freshness failure."
      },
      {
        "title": "Event processing concepts",
        "hours": 5,
        "topics": "Event time versus processing time; ordering; windows; delivery semantics.",
        "exercise": "Simulate out-of-order events and compare handling strategies."
      },
      {
        "title": "Pipeline capstone",
        "hours": 10,
        "topics": "End-to-end integration; replay tests; runbook; demonstration and assessment.",
        "exercise": "Demonstrate an incremental pipeline, a failure recovery and a safe replay."
      }
    ],
    "project": "Reliable order pipeline: ingest changing order records and publish a validated daily revenue table.",
    "deliverables": [
      "Runnable local ingestion and transformation code with sample source records",
      "Quality checks, repeat-run evidence and a simulated failure-recovery demonstration",
      "An architecture diagram, data contracts and an operator runbook"
    ],
    "rubric": [
      "Pipeline correctness and modelling — 30%",
      "Quality, idempotency and recovery — 40%",
      "Observability, security and runbook — 30%"
    ],
    "lesson": {
      "module": "06 · Incremental loads & idempotency",
      "title": "6.1 — A retry should not double your data",
      "minutes": 15,
      "learn": "An idempotent load gives the same final result when the same input is processed again. Retrying a failed task is normal, so blind append is often unsafe for current-state order tables. Use a stable business key and a defined update rule.",
      "example": "The target contains order 101 at amount 100. A batch contains an updated order 101 at 120 and new order 102 at 80. With a keyed upsert and a newer-version rule, the target ends with two orders totalling 200. Replaying the same batch leaves that result unchanged.",
      "prompt": "After replaying the same batch, what should a correct current-state target contain?",
      "choices": [
        "Four rows totalling 400",
        "Two orders totalling 200",
        "One order totalling 120"
      ],
      "correct": 1,
      "feedback": [
        "That indicates duplicate accumulation. A retry must not append the same logical orders again.",
        "Correct. Stable order keys and deterministic update rules preserve the same two-order state.",
        "The new order 102 must be retained alongside the updated order 101."
      ],
      "transfer": "An upsert alone is not enough if old events can overwrite new ones. Compare source versions or event timestamps, define tie-breaking, and test out-of-order updates as well as exact replays.",
      "next": "Next in the full programme: handle a late event without moving the watermark past unprocessed work."
    },
    "file": "data-engineering-certificate-demo.html"
  }
];
