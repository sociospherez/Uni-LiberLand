# Liberland University — hourly certificate content specification

Version 1.0 · 29 September 2026

## Status and provenance

Reconstructed from the supplied Admissions Online Gateway conversation. The original /mnt/data/excel-certificate-demo.html was not accessible. The recorded Excel six-module structure and 16-hour allocation are preserved. Visual styling interprets the stated light/graphite architectural direction; exact visual parity with the unavailable approved file has not been verified. No source archives were modified.

## Reference content and UX contract

Each prospectus includes overview, at-a-glance facts, target learners, required and helpful prerequisites, tools, six outcomes, timed modules with topics and activities, project deliverables, assessment, and completion requirements. Each demo includes one original sample lesson in the Learn → Worked Example → Try It → Check → Continue flow. Wrong answers receive specific feedback; a correct answer unlocks Continue. This marks only the sample complete. No learner account or persistent record exists.

## Common proposed assessment policy

Proposed assessment: module practice portfolio 40%; final project 60%. Formative lesson checks allow retries and do not contribute to the award score.

Complete all modules and submit the practice portfolio and final project.

Achieve at least 60% overall and at least 60% on the final project.

Meet the programme’s essential checks listed below and acknowledge any external help.

Revise work after feedback if needed; proposed resubmission arrangements require academic approval.

The final-project rubrics below each total 100%. Apply these within the project component, which is 60% of the overall mark. Essential programme checks must also pass. These are design proposals requiring academic approval, not established university regulations.

## Production work still required

Academic approval; full lesson authoring; extended licensed or synthetic datasets; tutor marking guides and support arrangements; software provisioning; learner accounts and accessibility review with users; enrolment, submissions and verified award issuance. The supplied tiny CSVs illustrate sample lessons only.

## Spreadsheet Modelling Using Excel — 16 hours

Level: Beginner | Proposed online self-paced delivery | Proposed completion certificate

### Overview

Build a spreadsheet that another person can understand, check and use. Start with tidy tables and dependable formulas, then turn a small business dataset into a simple decision model.

The programme follows a fictional independent retailer from raw sales records to a monthly margin report. You will practise separating inputs, calculations and outputs, making assumptions visible, and explaining what changes when an assumption changes.

### Target learner

- People who use spreadsheets at work but lack a consistent method

- Students and career changers starting business analysis

- Small-business owners planning sales and costs

### Prerequisites

Required: No prior Excel knowledge. You should be able to manage files and use basic arithmetic.

Helpful: Experience reading a simple business table.

Tools: Microsoft Excel with tables, standard formulas and charts. The sample lesson runs directly in this browser.

### Outcomes

- Organise a workbook into inputs, calculations and outputs

- Use relative and absolute references correctly

- Clean and summarise a small sales table

- Build revenue, cost and margin calculations

- Compare a baseline with a changed assumption

- Present and check a clear business report

### Modules

#### 01. Foundations & spreadsheet design — 2h

Workbook navigation; data types; tables; clear labels; input and output separation.

Practical activity: Create an inputs sheet and a structured sales table; identify three data-quality problems.

#### 02. Formulas & functions — 4h

Arithmetic; relative and absolute references; SUM; AVERAGE; IF; SUMIFS; formula errors.

Practical activity: Calculate line totals, apply a fixed rate, and copy formulas safely across a table.

#### 03. Data preparation & analysis — 3h

Blanks and duplicates; consistent dates; sorting and filtering; PivotTable summaries.

Practical activity: Clean the retailer records and reconcile category totals against overall sales.

#### 04. Business modelling — 3h

Revenue and variable costs; fixed costs; margin; assumption cells; simple scenarios.

Practical activity: Compare baseline and lower-volume scenarios and explain the effect on profit.

#### 05. Visualisation & reporting — 2h

Chart selection; readable number formats; meaningful titles; concise management commentary.

Practical activity: Produce a one-page monthly report with one chart and three findings.

#### 06. Practical project & assessment — 2h

Model audit; reconciliation; documentation; project submission and reflection.

Practical activity: Submit a checked workbook and a short recommendation for the retailer.

### Project

Retail margin planner: should a small retailer increase its monthly sales target?

- A workbook with a clean source table, labelled assumptions and formula-driven calculations

- A baseline and one alternative scenario, with totals reconciled

- A one-page report and a 150-word recommendation explaining one limitation

### Project rubric

- Formula accuracy and reconciliation — 40%

- Model structure and scenario logic — 30%

- Clarity, documentation and recommendation — 30%

Essential check: Formulas must recalculate correctly; source totals and report totals must reconcile.

### Sample lesson

02 · Formulas & functions / 2.2 — When should a reference stay fixed?

Learn: A relative reference moves when you copy a formula. An absolute reference stays fixed. Put a shared assumption in one labelled cell and lock its row and column with dollar signs. This makes the assumption easy to change without editing every formula.

Worked Example: B2 contains a net amount of 100. E1 contains a service rate of 0.20. In C2, =B2*$E$1 returns 20. Copy it to C3 and it becomes =B3*$E$1: the amount changes row, but the rate stays in E1.

Try It: B3 contains 150 and E1 contains 0.20. Which formula correctly calculates the service amount in C3 and can safely be copied down?

- =B3*E1

- =B3*$E$1

- =$B$3*E1

Correct answer: =B3*$E$1

Feedback:

- E1 is relative, so it will move to E2 when you copy down. Lock the shared rate.

- Correct. B3 follows each sales row while $E$1 stays fixed. The result here is 30.

- This locks the sales amount instead of the shared rate. Each row needs its own amount.

Continue: Change the rate in E1 to 0.25. Every correctly linked row updates; the amount for B3 becomes 37.50. In Excel, test both the rate change and a copied formula.

Next in the full programme: use IF to flag a margin below target.

## Time Series Forecasting — 24 hours

Level: Intermediate | Proposed online self-paced delivery | Proposed completion certificate

### Overview

Learn to forecast a quantity that changes over time and judge whether the forecast is useful. Work with monthly demand, identify patterns, and compare a simple baseline with more structured methods.

The emphasis is on honest evaluation: preserve time order, avoid using future information, and explain uncertainty. This is an introductory forecasting workflow rather than a promise of reliable predictions for every dataset.

### Target learner

- Analysts planning demand, staffing or inventory

- Operations staff moving beyond spreadsheet trend lines

- Learners comfortable with basic Python data analysis

### Prerequisites

Required: Basic Python and pandas, charts, averages and variability. Complete the Python certificate or demonstrate equivalent skills.

Helpful: Familiarity with business planning and elementary statistics.

Tools: Python notebook environment with pandas, matplotlib and statsmodels; CSV files. No paid forecasting service required.

### Outcomes

- Recognise trend, seasonality and missing periods

- Create naive and seasonal-naive baselines

- Split a series chronologically for evaluation

- Compare smoothing and introductory ARIMA models

- Measure error and interpret forecast intervals

- Communicate a forecast with assumptions and limits

### Modules

#### 01. Time series foundations — 3h

Time indexes; frequency; trend; seasonality; demand versus sales.

Practical activity: Plot monthly demand and annotate recurring peaks and missing periods.

#### 02. Preparing chronological data — 3h

Resampling; missing dates; aggregation; outliers; leakage prevention.

Practical activity: Create a regular monthly index and document a defensible treatment of gaps.

#### 03. Baselines & backtesting — 4h

Naive forecasts; seasonal naive; chronological holdouts; rolling origins; MAE.

Practical activity: Compare two baselines on a held-out period without shuffling dates.

#### 04. Forecasting methods — 5h

Moving averages; exponential smoothing; introductory stationarity and ARIMA concepts.

Practical activity: Fit a smoothing model and a simple ARIMA candidate; compare against the baseline.

#### 05. Uncertainty & model diagnosis — 4h

Residual patterns; forecast intervals; horizon-specific error; intermittent demand limitations.

Practical activity: Inspect errors and explain why uncertainty grows or changes across the horizon.

#### 06. Demand forecast project — 5h

Model selection; reproducible workflow; forecast presentation; assessment.

Practical activity: Submit a forecast, backtest results and a decision-focused planning note.

### Project

Demand planning brief: prepare a three-month forecast for a fictional retailer using an extended monthly series.

- A notebook showing preparation, chronological evaluation and at least two baselines

- One candidate model compared with the strongest baseline using MAE

- A three-month forecast with uncertainty discussion and a one-page planning recommendation

### Project rubric

- Data preparation and leakage-free evaluation — 35%

- Model comparison and error analysis — 40%

- Reproducibility and communication — 25%

Essential check: Evaluation must preserve time order and exclude future information from model fitting.

### Sample lesson

03 · Baselines & backtesting / 3.2 — Can your forecast beat yesterday?

Learn: A baseline is a deliberately simple forecast that gives your model something to beat. A naive forecast repeats the last observed value. Evaluate predictions on later observations, keeping those values hidden during model fitting. Mean absolute error (MAE) averages the size of the errors.

Worked Example: The last training observation is 100. A fixed-origin naive forecast for the next three months is [100, 100, 100]. The actual values are [110, 90, 120]. Absolute errors are [10, 10, 20], so MAE is 40 / 3 = 13.33 units.

Try It: A candidate model has MAE 16 on exactly the same holdout. Which conclusion is supported?

- The candidate is better because it is more complex

- The naive baseline has lower average error on this holdout

- Shuffle the dates until the candidate wins

Correct answer: The naive baseline has lower average error on this holdout

Feedback:

- Complexity does not establish usefulness. Compare errors on the same unseen periods.

- Correct. 13.33 is lower than 16. Keep the baseline as the reference and investigate other time windows.

- Shuffling breaks the forecasting setting and can leak future information.

Continue: A single holdout is limited evidence. Repeat the comparison at several chronological forecast origins before choosing a model.

Next in the full programme: compare a seasonal-naive forecast against the same horizon.

## Social Media Analytics — 24 hours

Level: Beginner | Proposed online self-paced delivery | Proposed completion certificate

### Overview

Turn social media activity into a clear account of what an organisation is achieving. Start with the business question, select meaningful measures, and compare content without mistaking a large audience for strong performance.

Use fictional campaign exports to practise data cleaning, audience and content analysis, simple experiment design and reporting. Distinguish observed association from evidence of causal impact.

### Target learner

- Marketing coordinators and content creators

- Small-business owners reviewing campaigns

- Learners entering digital marketing analysis

### Prerequisites

Required: Basic spreadsheet use, percentages and the ability to read a chart. No coding required.

Helpful: Experience planning or publishing social content.

Tools: Excel or another spreadsheet application; supplied fictional exports. A live social account or API is unnecessary.

### Outcomes

- Translate campaign goals into measurable questions

- Define engagement and conversion metrics consistently

- Clean and compare campaign exports

- Analyse content and audience segments responsibly

- Design a simple test with a stated success measure

- Present recommendations with attribution limitations

### Modules

#### 01. Goals & measurement — 3h

Awareness versus action; metric definitions; campaign objectives; measurement plans.

Practical activity: Write a measurement plan for a fictional event campaign.

#### 02. Data collection & quality — 4h

Export structures; date windows; missing values; duplicate posts; ethical collection.

Practical activity: Clean a mixed campaign export and create a metric dictionary.

#### 03. Audience & content analysis — 4h

Content categories; segmentation; rates versus totals; reach and impressions.

Practical activity: Compare formats using a consistent denominator and report sample sizes.

#### 04. Campaign performance — 4h

Engagement rate; click-through rate; conversion rate; tagged links; attribution limits.

Practical activity: Build a campaign summary that separates engagement from website outcomes.

#### 05. Experiments & interpretation — 4h

Test hypotheses; random assignment concepts; confounders; sentiment sampling and coding.

Practical activity: Draft a two-variant content test and manually code a small fictional comment set.

#### 06. Campaign insight project — 5h

Dashboard; evidence hierarchy; recommendations; assessment.

Practical activity: Deliver a campaign review and a proposed follow-up experiment.

### Project

Campaign review: decide which content formats deserve a follow-up test for a fictional university open day.

- A cleaned export and metric dictionary with explicit denominators

- A compact report comparing formats and campaign objectives

- Three evidence-linked recommendations and a test plan with limitations

### Project rubric

- Metric definitions and data quality — 35%

- Analysis and interpretation — 35%

- Recommendations, ethics and test design — 30%

Essential check: Every reported rate must name its denominator, time window and data source.

### Sample lesson

03 · Audience & content analysis / 3.1 — Which post really performed better?

Learn: Totals and rates answer different questions. Total engagements describe volume. Engagements divided by impressions describe engagements per display, not the proportion of unique people who engaged. Always name the denominator and keep the definition consistent between posts.

Worked Example: Post A has 120 engagements from 4,000 impressions: 120 / 4,000 × 100 = 3%. Post B has 80 engagements from 1,000 impressions: 8%. A has more engagements in total; B has the higher rate.

Try It: Your stated goal is the higher engagement rate per impression. Which post leads?

- Post A, because 120 exceeds 80

- Post B, at 8%

- Both, because impressions measure unique people

Correct answer: Post B, at 8%

Feedback:

- That answers the volume question. The stated goal asks for the rate.

- Correct. B has the higher rate; A still generated more engagements overall. Neither result establishes conversions or causal impact.

- Impressions can include repeated displays to the same person. They are not unique reach.

Continue: Before recommending B, inspect the campaign objective, audience, spend and sample size. A useful report can show both the rate and total.

Next in the full programme: connect campaign clicks to a separately defined conversion measure.

## Programming for Data Analytics Using Python — 24 hours

Level: Beginner | Proposed online self-paced delivery | Proposed completion certificate

### Overview

Learn enough Python to turn a small dataset into a reproducible analysis. Build confidence with variables, functions and errors before working with tables and charts.

Follow a fictional sales investigation from a CSV file to an explained result. Short coding exercises lead to a notebook that someone else can rerun, with assumptions and checks visible.

### Target learner

- First-time programmers interested in data

- Spreadsheet users wanting repeatable analysis

- Students preparing for more technical certificates

### Prerequisites

Required: No programming experience. Basic arithmetic, file management and access to a computer.

Helpful: Familiarity with tables and spreadsheet formulas.

Tools: Python 3 notebook environment with pandas and matplotlib, locally installed or institution-provided.

### Outcomes

- Use variables, types, conditions and loops

- Write and call a small function

- Read an error message and isolate its cause

- Load, filter and summarise tabular data

- Handle missing values with an explicit rationale

- Create a reproducible notebook with charts and conclusions

### Modules

#### 01. Getting started — 3h

Notebook cells; variables; types; arithmetic; running cells in order.

Practical activity: Calculate order revenue and annotate the assumptions.

#### 02. Programming building blocks — 4h

Lists; dictionaries; conditions; loops; functions.

Practical activity: Write a reusable function that calculates a discounted price.

#### 03. Working with data — 4h

CSV input; DataFrames; selecting columns; filtering; grouping.

Practical activity: Summarise sales by region and inspect the intermediate tables.

#### 04. Cleaning & debugging — 4h

Missing values; data types; duplicates; exceptions; assertions.

Practical activity: Repair an inconsistent sales table and add checks for impossible values.

#### 05. Exploration & communication — 4h

Descriptive summaries; chart selection; labels; correlation limits.

Practical activity: Create two charts and distinguish observations from explanations.

#### 06. Reproducible analysis project — 5h

Notebook narrative; functions; restart-and-run validation; assessment.

Practical activity: Deliver a rerunnable sales analysis with documented decisions.

### Project

Sales investigation: explain differences in regional order values using a reproducible notebook.

- A notebook with imports, data loading, cleaning decisions and reusable logic

- Regional summaries and two clearly labelled charts

- A short findings section with checks, caveats and rerun instructions

### Project rubric

- Code correctness and data handling — 40%

- Analysis and visual explanation — 30%

- Reproducibility and documentation — 30%

Essential check: The notebook must rerun from start to finish and explicitly handle missing data.

### Sample lesson

04 · Cleaning & debugging / 4.1 — Missing is not the same as zero

Learn: A missing value means that a value is unknown or absent. Zero is a known quantity. Replacing missing values with zero can distort an average. Inspect the meaning of a column and record how many values were missing before deciding what to do.

Worked Example: Order values are [20, missing, 40]. For this example, report the average of known values: (20 + 40) / 2 = 30. In pandas: sales["amount"].mean(). Also report sales["amount"].isna().sum(), which is 1. This is not proof that the missing order was typical.

Try It: If you replace the missing amount with zero, what average do you get?

- 20

- 30

- 60

Correct answer: 20

Feedback:

- Correct. (20 + 0 + 40) / 3 = 20. The replacement changes the result, so it requires a defensible reason.

- 30 is the mean of the two known values, excluding the missing observation.

- 60 is the sum of known values, not their mean.

Continue: The CSV leaves the missing amount blank. Compare the mean before and after fillna(0), then write one sentence explaining which interpretation fits the business question.

Next in the full programme: validate numeric types before grouping sales by region.

## Dashboarding & Storytelling Using Power BI — 24 hours

Level: Foundation | Proposed online self-paced delivery | Proposed completion certificate

### Overview

Create a report that helps a reader make a decision. Prepare business data, build a sensible model, define measures and arrange visuals around a clear question.

Work towards a fictional retail performance dashboard. The focus is reliable calculations and understandable stories, with attention to filters, accessibility and the difference between a report page and a recommendation.

### Target learner

- Spreadsheet analysts moving into dashboards

- Managers producing recurring performance reports

- Learners interested in business intelligence

### Prerequisites

Required: Confidence with spreadsheet tables, percentages and basic charts. No DAX experience required.

Helpful: Familiarity with relationships between orders, products and customers.

Tools: Power BI Desktop on a compatible Windows computer. The browser sample needs no installation; sharing-service permissions are outside the demo.

### Outcomes

- Prepare data using repeatable transformations

- Model related tables at a clear level of detail

- Create basic measures and explain filter context

- Select visuals that answer a business question

- Build an accessible, coherent report journey

- Validate totals and present a decision-focused story

### Modules

#### 01. Questions & report planning — 2h

Audience; decisions; KPI definitions; page sketches.

Practical activity: Sketch a report answering where margin is falling.

#### 02. Data preparation — 4h

Power Query steps; types; missing values; merging and appending.

Practical activity: Prepare orders and products while preserving a traceable transformation sequence.

#### 03. Modelling & relationships — 4h

Fact and dimension tables; keys; grain; relationship direction; date table concepts.

Practical activity: Create a small star model and check that joins do not duplicate sales.

#### 04. Measures & filter context — 5h

Measures versus columns; SUM; DIVIDE; CALCULATE introduction; filter effects.

Practical activity: Build revenue, margin and margin-rate measures and reconcile them to source totals.

#### 05. Visual storytelling — 4h

Visual selection; hierarchy; slicers; accessible colour; tooltips; narrative.

Practical activity: Create overview and detail pages that guide a reader from finding to evidence.

#### 06. Dashboard project & validation — 5h

Report testing; annotated findings; delivery and assessment.

Practical activity: Submit a validated report and a short walkthrough of the business decision.

### Project

Retail performance story: identify which region warrants a margin investigation.

- A report file with a documented model and repeatable preparation steps

- Measures, an overview page and a supporting detail page

- A validation checklist and a three-minute walkthrough script

### Project rubric

- Data model and measure accuracy — 40%

- Report usability and accessibility — 30%

- Evidence, validation and narrative — 30%

Essential check: Report totals must reconcile and relationships must not inflate measures.

### Sample lesson

04 · Measures & filter context / 4.2 — Why averaging percentages can mislead

Learn: To show overall margin rate, divide total margin by total revenue. Averaging row percentages gives each row equal influence, even when the revenues differ. Define a measure that responds to the selected data while keeping the business meaning intact.

Worked Example: North: revenue 100, margin 20 (20%). South: revenue 900, margin 90 (10%). Total margin rate = 110 / 1,000 = 11%. A simple average of the regional percentages is 15%, which is not the overall margin rate. Example measure: Margin Rate = DIVIDE(SUM(Sales[Margin]), SUM(Sales[Revenue])).

Try It: What should the overall margin-rate card show when both regions are selected?

- 15%

- 30%

- 11%

Correct answer: 11%

Feedback:

- 15% averages the two rates without considering their different revenues.

- Adding percentages does not produce the combined rate.

- Correct. Divide total margin 110 by total revenue 1,000. Format the measure as a percentage.

Continue: Filter to North only: the same ratio-of-totals measure becomes 20%. This is an example of filter context changing the rows included in the calculation.

Next in the full programme: test a measure under region and date filters.

## Database Management Using SQL & MongoDB — 24 hours

Level: Foundation | Proposed online self-paced delivery | Proposed completion certificate

### Overview

Learn how structured and document databases store business information, and choose a suitable representation for a simple application. Practise querying, joining and aggregating data while preserving its meaning.

The programme compares SQL tables and MongoDB documents through a small order-management case. It introduces safe updates, validation and basic access control; it is a foundation in database use rather than advanced database administration.

### Target learner

- Analysts who need to retrieve their own data

- Junior developers learning persistence

- Learners preparing for data engineering

### Prerequisites

Required: Comfort with tables, identifiers and logical conditions. No prior database programming required.

Helpful: Basic scripting or spreadsheet lookup experience.

Tools: A local SQL practice database such as SQLite and a MongoDB practice environment with a query shell. Use disposable sample data.

### Outcomes

- Design tables with keys and sensible relationships

- Retrieve and aggregate records using SQL

- Explain how joins affect row counts

- Model and query simple MongoDB documents

- Choose embedding or references for a stated use case

- Apply basic validation, safe-change and access principles

### Modules

#### 01. Data models & integrity — 3h

Entities; keys; one-to-many relationships; constraints; normalisation basics.

Practical activity: Model customers, orders and order lines with explicit keys.

#### 02. SQL queries — 5h

SELECT; WHERE; ORDER BY; NULL; GROUP BY; aggregate functions.

Practical activity: Answer five order questions and check the treatment of missing values.

#### 03. Joins & safe changes — 4h

INNER and LEFT joins; duplication; INSERT and UPDATE; transaction concepts.

Practical activity: Join orders to lines, reconcile totals and rehearse a change in a practice database.

#### 04. MongoDB documents — 4h

Collections; document shape; nested fields; find; projections; updates.

Practical activity: Represent an order as a document and query its nested delivery details.

#### 05. Aggregation & design choices — 3h

Aggregation pipelines; embedding versus references; index concepts; validation and access.

Practical activity: Aggregate document orders and justify one modelling decision.

#### 06. Dual-model project — 5h

Equivalent queries; integrity checks; documentation; assessment.

Practical activity: Deliver relational and document versions of the order case with query results.

### Project

Order-system comparison: answer the same business questions from tables and documents.

- A relational schema with sample records and five checked SQL queries

- Equivalent MongoDB documents and two aggregation/query examples

- A design note covering keys, duplication, safe changes and access

### Project rubric

- Query accuracy and validation — 40%

- Data modelling and integrity — 35%

- Design rationale and documentation — 25%

Essential check: Keys and joins must preserve the intended grain; submitted results must match source records.

### Sample lesson

03 · Joins & safe changes / 3.1 — Why did the total double?

Learn: A join returns matching combinations of rows. If an order has two lines, joining the order header to those lines produces two rows. Summing a header-level total after that join counts the same order twice. Identify the grain: what does one row represent?

Worked Example: Order 101 has an order_total of 100 and two lines worth 40 and 60. SELECT SUM(o.order_total) FROM orders o JOIN lines l ON o.order_id = l.order_id returns 200 for this example. Summing the line values returns 100, as does summing the unjoined order table.

Try It: You need revenue across all orders. Which approach is sound for this model?

- Sum order_total in the orders table before joining lines

- Use SUM(DISTINCT order_total) for every business dataset

- Add more joins until the duplicate rows disappear

Correct answer: Sum order_total in the orders table before joining lines

Feedback:

- Correct. Preserve the order grain. If you need line-level analysis, aggregate the appropriate line amounts instead.

- Different orders can have the same total. DISTINCT can incorrectly collapse their values.

- More joins can introduce further duplication. Check the grain and relationships first.

Continue: Before and after any join, compare row counts, distinct order IDs and reconciled totals. Repetition may be valid at the line grain but invalid for summing order headers.

Next in the full programme: preserve customers with no orders using a LEFT JOIN.

## Artificial Intelligence & Deep Learning Using Python — 40 hours

Level: Intermediate | Proposed online self-paced delivery | Proposed completion certificate

### Overview

Build and evaluate a small supervised learning system, then explore how a neural network learns from data. Begin with a simple baseline so that added complexity has a clear purpose.

Use manageable tabular and image examples to study preprocessing, training, validation and error analysis. The programme emphasises leakage prevention, responsible use and honest reporting; it does not qualify a model for high-stakes deployment.

### Target learner

- Python-capable analysts beginning machine learning

- Developers exploring neural networks

- Learners ready to connect statistics with practical modelling

### Prerequisites

Required: Python functions, pandas and NumPy basics; averages, probability concepts and basic algebra. The beginner Python certificate alone may need additional practice.

Helpful: Vectors, derivatives and prior train/test split experience.

Tools: Python notebooks with NumPy, pandas, scikit-learn and an instructor-selected neural-network framework. Small CPU-friendly exercises; no paid GPU required for the demo scope.

### Outcomes

- Define a supervised learning task and baseline

- Separate training, validation and test data

- Fit preprocessing without leaking held-out information

- Train a small neural network and interpret learning curves

- Select metrics appropriate to class balance and error costs

- Document model limitations and responsible-use boundaries

### Modules

#### 01. Problem framing & AI foundations — 3h

Prediction versus explanation; supervised tasks; error costs; responsible use.

Practical activity: Write a model brief identifying the decision, target and unacceptable errors.

#### 02. Data preparation & splits — 5h

Features and labels; scaling; encoding; split strategy; leakage.

Practical activity: Create a preprocessing pipeline fitted only on training data.

#### 03. Classical baselines — 5h

Dummy predictors; logistic regression; trees; cross-validation concepts.

Practical activity: Compare a simple learned model with a dummy baseline.

#### 04. Neural-network foundations — 5h

Weights; activations; loss; gradient descent; batches; epochs.

Practical activity: Trace a tiny forward calculation and explain a loss curve.

#### 05. Training small networks — 6h

Dense networks; optimisers; validation; learning rates; reproducibility.

Practical activity: Train a small classifier and record its training configuration.

#### 06. Generalisation & diagnosis — 5h

Overfitting; regularisation; early stopping; confusion matrix; class imbalance.

Practical activity: Diagnose learning curves and compare precision and recall.

#### 07. Deep-learning applications & responsibility — 4h

Introductory image classification; transfer learning concepts; bias; privacy; model cards.

Practical activity: Inspect error examples and draft a restricted-use model card.

#### 08. Model comparison project — 7h

Reproducible evaluation; held-out test; error analysis; assessment.

Practical activity: Submit a baseline/network comparison and an evidence-based recommendation.

### Project

Classifier comparison: determine whether a small neural network improves on a simple baseline for a low-risk labelled dataset.

- A reproducible notebook with a justified split and leakage-safe preprocessing

- Baseline and network metrics, learning curves and error examples

- A model card covering intended use, class balance, limitations and reproducibility

### Project rubric

- Evaluation design and leakage prevention — 35%

- Implementation and diagnostic analysis — 40%

- Responsible-use documentation and clarity — 25%

Essential check: Test data must remain untouched during fitting and tuning; metrics must reflect class balance.

### Sample lesson

06 · Generalisation & diagnosis / 6.2 — When 95% accuracy tells the wrong story

Learn: Accuracy is the proportion of all predictions that are correct. It can conceal complete failure on a rare class. Recall for the positive class is true positives divided by all actual positives. Choose metrics based on what the errors mean.

Worked Example: A test set has 95 negative cases and 5 positive cases. A model predicts negative for everyone. It is correct on 95 of 100 cases, so accuracy is 95%. It finds zero of the five positives, so positive-class recall is 0%.

Try It: What is the model’s positive-class recall?

- 95%

- 5%

- 0%

Correct answer: 0%

Feedback:

- That is the overall accuracy, dominated by the negative class.

- 5% is the prevalence of positive cases, not recall.

- Correct. Recall = 0 / 5 = 0%. The model misses every actual positive.

Continue: Positive precision has a zero denominator here because no positives were predicted. Report that explicitly rather than presenting it as evidence of strong performance. Inspect the confusion matrix alongside accuracy.

Next in the full programme: compare decision thresholds and their precision–recall trade-off.

## Business Analytics Professional — 50 hours

Level: Foundation to intermediate | Proposed online self-paced delivery | Proposed completion certificate

### Overview

Move from an ambiguous business problem to a defensible recommendation. Combine data quality, descriptive analysis, basic statistical reasoning, forecasting and decision modelling in one applied workflow.

The longer format allows several linked case exercises and a substantial capstone. The word Professional identifies the programme title; the proposed award is a certificate of completion, not a professional licence or externally accredited designation.

### Target learner

- Business professionals taking on analytical responsibilities

- Analysts who want a stronger decision-making framework

- Career changers with spreadsheet experience

### Prerequisites

Required: Confident spreadsheet use, formulas, charts and percentages. Prior completion of the Excel certificate or equivalent experience.

Helpful: Exposure to business operations and introductory statistics.

Tools: A spreadsheet application for core work; optional SQL or Power BI for learners with prior experience. No coding requirement.

### Outcomes

- Turn a business issue into a scoped analytical brief

- Define KPIs and assess data fitness

- Use descriptive statistics and visual analysis

- Interpret uncertainty and distinguish correlation from causation

- Compare forecasting and scenario-based decision options

- Deliver a supported recommendation with an implementation measure

### Modules

#### 01. Business framing — 4h

Stakeholders; problem statements; decision criteria; scope.

Practical activity: Write an analytical brief for a retailer with declining profit.

#### 02. Data literacy & governance — 4h

Sources; definitions; access; privacy; bias; data-quality checks.

Practical activity: Create a data dictionary and a quality-risk register.

#### 03. Preparation & exploration — 5h

Cleaning; joins conceptually; aggregation; distributions; outliers.

Practical activity: Build a reproducible analysis table and an exploration log.

#### 04. KPIs & visual analysis — 5h

Metric trees; segmentation; leading and lagging indicators; visual selection.

Practical activity: Decompose profit by region, product and period.

#### 05. Statistics for decisions — 5h

Sampling; variation; confidence intervals conceptually; correlation.

Practical activity: Explain uncertainty in an estimated customer average without claiming causation.

#### 06. Experiments & causal caution — 4h

Hypotheses; comparison groups; randomisation; confounders; practical significance.

Practical activity: Design a pricing test with a primary outcome and guardrail.

#### 07. Forecasting & planning — 5h

Naive baselines; seasonality; holdouts; forecast error; planning assumptions.

Practical activity: Evaluate a simple demand forecast and explain planning implications.

#### 08. Decision & scenario modelling — 5h

Contribution margin; break-even; sensitivity; constrained choices.

Practical activity: Compare two operating options and test the assumption that could reverse the choice.

#### 09. Stakeholder storytelling — 4h

Executive summaries; evidence chains; visual narrative; implementation metrics.

Practical activity: Prepare a five-slide recommendation and respond to a stakeholder objection.

#### 10. Integrated business capstone — 9h

Integrated analysis; validation; recommendation; review and assessment.

Practical activity: Submit a decision brief, supporting model and implementation measurement plan.

### Project

Retail recovery plan: recommend one intervention to improve contribution while protecting customer outcomes.

- A scoped brief, data dictionary and checked analytical model

- An option comparison with sensitivity analysis and uncertainty discussion

- A five-slide executive story and a measurement plan with named decision criteria

### Project rubric

- Problem framing and data fitness — 20%

- Analytical correctness and option comparison — 40%

- Recommendation and implementation measures — 25%

- Communication and limitations — 15%

Essential check: The recommendation must follow the stated criterion and include a sensitivity check.

### Sample lesson

08 · Decision & scenario modelling / 8.1 — Revenue is not contribution

Learn: Contribution equals revenue minus variable costs. A larger sales figure can hide a weaker economic result. Compare options against the decision’s stated objective, then examine capacity, uncertainty and any fixed-cost differences before making a recommendation.

Worked Example: Option A sells 100 units at 50, with variable cost 30 per unit. Contribution = 100 × (50 − 30) = 2,000. Option B sells 140 units at 45, with variable cost 32. Contribution = 140 × 13 = 1,820. Fixed costs are equal in this example.

Try It: With contribution as the criterion and all other factors held equal, which option leads?

- A, by 180

- B, because it generates more revenue

- They are equal because fixed costs are equal

Correct answer: A, by 180

Feedback:

- Correct. A contributes 2,000 versus 1,820. This is a conditional comparison, not a complete investment decision.

- B has revenue 6,300 versus 5,000, but its lower unit contribution produces a lower total contribution.

- Equal fixed costs do not make different contribution totals equal.

Continue: At a unit contribution of 13, B needs more than 2,000 / 13 = 153.85 units to exceed A. For whole units, that means at least 154. Test whether this volume is plausible.

Next in the full programme: add a capacity constraint and document what changes the recommendation.

## Applied Data Engineering — 60 hours

Level: Intermediate | Proposed online self-paced delivery | Proposed completion certificate

### Overview

Build a small, dependable data pipeline from ingestion to an analytical output. Learn to make data contracts explicit, detect bad records, rerun work safely and explain how the system behaves when something fails.

The programme uses a local batch pipeline to keep the operational concepts visible. It introduces orchestration, warehouse modelling and event processing without assuming a production cloud subscription or presenting a small lab as a production platform.

### Target learner

- Python and SQL users progressing into data engineering

- Analysts maintaining repeatable data workflows

- Junior developers working with analytical datasets

### Prerequisites

Required: Working Python, file I/O, functions and SQL joins/grouping; basic command-line use. Complete the Python and database certificates plus independent practice, or demonstrate equivalent experience.

Helpful: Git, virtual environments and basic relational modelling.

Tools: Python, a local analytical SQL database and a local workflow scheduler selected for teaching. Files and simulated API responses; no paid cloud account required.

### Outcomes

- Define source contracts and target table grain

- Build incremental batch ingestion with validation

- Transform raw records into useful analytical tables

- Design idempotent loads and handle late updates

- Schedule, monitor and recover a small workflow

- Document security, lineage and operational limits

### Modules

#### 01. Architecture & contracts — 4h

Sources; consumers; batch versus events; schema contracts; system boundaries.

Practical activity: Draw a pipeline and define required fields and ownership.

#### 02. Python ingestion — 6h

CSV and JSON; API concepts; pagination; retries; raw storage.

Practical activity: Ingest simulated paginated responses while preserving raw records.

#### 03. SQL transformations — 6h

Staging; joins; aggregation; window-function concepts; grain.

Practical activity: Transform order events into a checked daily sales table.

#### 04. Analytical data modelling — 6h

Facts and dimensions; surrogate keys; changing attributes; warehouse layers.

Practical activity: Model an order fact and customer dimension with documented keys.

#### 05. Data quality & testing — 6h

Schema checks; nulls; uniqueness; referential integrity; quarantine.

Practical activity: Reject or quarantine malformed records and reconcile accepted totals.

#### 06. Incremental loads & idempotency — 6h

Watermarks; upserts; deduplication; late data; replay.

Practical activity: Rerun an incremental batch without creating duplicate orders.

#### 07. Orchestration & recovery — 6h

Task dependencies; scheduling; retries; backfills; failure isolation.

Practical activity: Create a local workflow and recover from an intentionally failed task.

#### 08. Observability & secure operation — 5h

Logs; freshness; row counts; alerts; least privilege; secrets handling.

Practical activity: Produce a run summary and a response guide for a freshness failure.

#### 09. Event processing concepts — 5h

Event time versus processing time; ordering; windows; delivery semantics.

Practical activity: Simulate out-of-order events and compare handling strategies.

#### 10. Pipeline capstone — 10h

End-to-end integration; replay tests; runbook; demonstration and assessment.

Practical activity: Demonstrate an incremental pipeline, a failure recovery and a safe replay.

### Project

Reliable order pipeline: ingest changing order records and publish a validated daily revenue table.

- Runnable local ingestion and transformation code with sample source records

- Quality checks, repeat-run evidence and a simulated failure-recovery demonstration

- An architecture diagram, data contracts and an operator runbook

### Project rubric

- Pipeline correctness and modelling — 30%

- Quality, idempotency and recovery — 40%

- Observability, security and runbook — 30%

Essential check: A repeated batch must not duplicate current-state records; recovery and quality checks must be demonstrated.

### Sample lesson

06 · Incremental loads & idempotency / 6.1 — A retry should not double your data

Learn: An idempotent load gives the same final result when the same input is processed again. Retrying a failed task is normal, so blind append is often unsafe for current-state order tables. Use a stable business key and a defined update rule.

Worked Example: The target contains order 101 at amount 100. A batch contains an updated order 101 at 120 and new order 102 at 80. With a keyed upsert and a newer-version rule, the target ends with two orders totalling 200. Replaying the same batch leaves that result unchanged.

Try It: After replaying the same batch, what should a correct current-state target contain?

- Four rows totalling 400

- Two orders totalling 200

- One order totalling 120

Correct answer: Two orders totalling 200

Feedback:

- That indicates duplicate accumulation. A retry must not append the same logical orders again.

- Correct. Stable order keys and deterministic update rules preserve the same two-order state.

- The new order 102 must be retained alongside the updated order 101.

Continue: An upsert alone is not enough if old events can overwrite new ones. Compare source versions or event timestamps, define tie-breaking, and test out-of-order updates as well as exact replays.

Next in the full programme: handle a late event without moving the watermark past unprocessed work.