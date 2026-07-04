"use client";

import SectionHeading from "../../components/learning/SectionHeading";
import GuideCard from "../../components/learning/GuideCard";
import GlossaryCard from "../../components/learning/GlossaryCard";

export default function LearningHubPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 md:px-6 pb-16 pt-8 space-y-12">
        {/* Hero */}
        <section className="rounded-3xl bg-gradient-to-r from-emerald-50 via-emerald-25 to-slate-50 px-6 py-10 shadow-sm border border-emerald-50">
          <p className="inline-flex items-center rounded-full bg-emerald-100/80 px-3 py-1 text-xs font-medium text-emerald-700 mb-4">
            Learning Hub for Beginners
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold text-slate-900">
            Start Your <span className="text-emerald-600">Investment Journey</span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-600">
            New to investing? Learn everything from basics to advanced mutual fund
            concepts in simple, jargon‑free language tailored for Indian
            middle‑class investors.
          </p>
        </section>

        {/* Getting Started Guides */}
        <section>
          <SectionHeading
            title="Getting Started Guides"
            subtitle="Essential reading for new investors."
          />

          <div className="grid gap-5 md:grid-cols-2">
            <GuideCard
              icon="💡"
              title="What is Investing?"
              level="Beginner"
              readTime="5 min read"
              href="https://www.rbl.bank.in/blog/banking/investment/beginner-guide-to-investing-in-india"

              bullets={[
                "Learn why investing matters for your financial future.",
                "Understand how investing grows your wealth with compound returns.",
                "See how investing is different from just saving in a bank account.",
              ]}
            />

            <GuideCard
              icon="📊"
              title="Mutual Funds 101"
              level="Beginner"
              readTime="8 min read"
              href="https://www.finnovate.in/learn/blog/understanding-mutual-funds"
              bullets={[
                "How mutual funds pool money and invest across stocks and bonds.",
                "Why professional fund managers make decisions on your behalf.",
                "How SIP lets you start with small monthly amounts.",
              ]}
            />

            <GuideCard
              icon="📈"
              title="Stock Market Basics"
              level="Beginner"
              readTime="10 min read"
              href="https://zerodha.com/varsity/module/introduction-to-stock-markets/"

              bullets={[
                "What shares are and how stock exchanges like NSE & BSE work.",
                "Why prices move with news, earnings and sentiment.",
                "Where equities fit inside a long‑term portfolio.",
              ]}
            />

            <GuideCard
              icon="🎯"
              title="Understanding Risk & Return"
              level="Beginner"
              readTime="7 min read"
               href="https://kuvera.in/blog/understanding-the-mutual-fund-risk-and-return-matrix/"
              bullets={[
                "Higher potential returns usually require taking more risk.",
                "Diversification helps reduce risk by spreading investments.",
                "Risk tolerance depends on age, goals and time horizon.",
              ]}
            />
          </div>
        </section>

        {/* Types of Mutual Funds */}
        <section>
          <SectionHeading
            title="Types of Mutual Funds"
            subtitle="Compare different fund categories to find what suits your goals."
          />

          <div className="grid gap-5 md:grid-cols-4">
            {[
              {
                name: "Equity Funds",
                desc: "Invest in stocks for long‑term wealth creation.",
                risk: "High",
                returns: "12–15%",
                tenure: "5+ years",
              },
              {
                name: "Debt Funds",
                desc: "Invest in bonds for stable, predictable returns.",
                risk: "Low",
                returns: "6–8%",
                tenure: "1–3 years",
              },
              {
                name: "Hybrid Funds",
                desc: "Mix of equity and debt for balanced growth.",
                risk: "Medium",
                returns: "9–12%",
                tenure: "3–5 years",
              },
              {
                name: "Index Funds",
                desc: "Track market indices like Nifty 50 with low fees.",
                risk: "Medium",
                returns: "10–12%",
                tenure: "5+ years",
              },
            ].map((card) => (
              <article
                key={card.name}
                className="rounded-3xl bg-white border border-slate-100 px-5 py-5 shadow-sm flex flex-col gap-3"
              >
                <div className="h-10 w-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 text-xl">
                  📁
                </div>
                <h3 className="text-base font-semibold text-slate-900">
                  {card.name}
                </h3>
                <p className="text-xs text-slate-600">{card.desc}</p>

                <dl className="mt-2 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <dt className="text-slate-400">Risk Level</dt>
                    <dd
                      className={
                        card.risk === "High"
                          ? "text-rose-500 font-medium"
                          : card.risk === "Low"
                          ? "text-emerald-600 font-medium"
                          : "text-amber-500 font-medium"
                      }
                    >
                      {card.risk}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-400">Expected Returns</dt>
                    <dd className="text-slate-700 font-medium">
                      {card.returns}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-400">Ideal Tenure</dt>
                    <dd className="text-slate-700 font-medium">
                      {card.tenure}
                    </dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </section>

        {/* Glossary */}
        <section>
          <SectionHeading
            title="Investment Glossary"
            subtitle="Key terms every mutual fund investor should know."
          />

          <div className="grid gap-4 md:grid-cols-2">
            <GlossaryCard
              term="NAV (Net Asset Value)"
              definition="Per‑unit price of a mutual fund, calculated by dividing total assets minus liabilities by the number of units."
            />
            <GlossaryCard
              term="SIP (Systematic Investment Plan)"
              definition="Investing a fixed amount regularly into a mutual fund, helping average out market volatility."
            />
            <GlossaryCard
              term="Expense Ratio"
              definition="Annual fee charged by the fund to cover management costs; lower is generally better for long‑term investors."
            />
            <GlossaryCard
              term="CAGR (Compound Annual Growth Rate)"
              definition="Average annual return of an investment over a period, accounting for compounding."
            />
            <GlossaryCard
              term="Sharpe Ratio"
              definition="Measures risk‑adjusted returns; a higher Sharpe ratio means better returns for the risk taken."
            />
            <GlossaryCard
              term="Alpha"
              definition="Excess return of a fund compared to its benchmark; positive alpha means the fund outperformed."
            />
            <GlossaryCard
              term="Beta"
              definition="Measures a fund's volatility relative to the market; beta above 1 means more volatile than market."
            />
            <GlossaryCard
              term="AUM (Assets Under Management)"
              definition="Total market value of investments managed by a fund; higher AUM often indicates investor trust."
            />
          </div>
        </section>
      </div>
    </main>
  );
}
