import { GetHtml } from "@/lib/utils";

export const CrexDetails = async (url: string) => {
  const $: any = await GetHtml(url);

  /* ===============================
     🧑‍🤝‍🧑 TEAM FORM (MATCH YOUR UI)
  =============================== */

  const teamForm: any[] = [];

  $(".format-match").each((_: any, el: any) => {
    const teamId = $(el)
      .find("img[id$='arrow']")
      .attr("id")
      ?.replace("arrow", "");

    const last5 = $(el)
      .find(".match span")
      .map((_: any, e: any) => $(e).text().trim())
      .get();

    teamForm.push({
      teamId,
      teamName: $(el).find(".form-team-name").text().trim(),
      teamFlag: $(el).find(".form-team-img").attr("src") || null,
      last5,
      matches: [], // fill next
    });
  });

  // expand details
  $(".format-match-exp").each((_: any, section: any) => {
    const teamId = $(section).attr("id");

    const matches = $(section)
      .find(".team-form-card")
      .map((_: any, card: any) => {
        const teams = $(card)
          .find(".form-team-detail")
          .map((_: any, t: any) => ({
            name: $(t).find(".team-name").text().trim(),
            score: $(t).find(".team-score").text().trim(),
            overs: $(t).find(".team-over").text().trim(),
            flag: $(t).find("img").attr("src") || null,
          }))
          .get();

        return {
          matchName: $(card).find(".match-name").text().trim(),
          series: $(card).find(".series-name").text().trim(),
          result: $(card)
            .find(".win.match span, .loss.match span")
            .text()
            .trim(),
          teams,
          matchUrl: "https://crex.com" + ($(card).attr("href") || ""),
        };
      })
      .get();

    const team = teamForm.find((t) => t.teamId === teamId);
    if (team) team.matches = matches;
  });

  /* ===============================
     🆚 HEAD TO HEAD (MATCH STRUCTURE)
  =============================== */

  const h2h = {
    team1: {
      name: $(".team1 .team-name").text().trim(),
      logo: $(".team1 img").attr("src") || "",
      wins: Number($(".team1-wins").text().trim() || 0),
    },
    team2: {
      name: $(".team2 .team-name").text().trim(),
      logo: $(".team2 img").attr("src") || "",
      wins: Number($(".team2-wins").text().trim() || 0),
    },
    matches: $(".global-match-card")
      .map((_: any, el: any) => ({
        matchUrl: "https://crex.com" + ($(el).attr("href") || ""),
        team1: $(el).find(".team-name").eq(0).text().trim(),
        team1Score: $(el).find(".team-score").eq(0).text().trim(),
        team1Overs: $(el).find(".team-over").eq(0).text().trim(),
        team2: $(el).find(".team-name").eq(1).text().trim(),
        team2Score: $(el).find(".team-score").eq(1).text().trim(),
        team2Overs: $(el).find(".team-over").eq(1).text().trim(),
        result: $(el).find(".match-dec-text").text().trim(),
        series: $(el).find(".series-name").text().trim(),
      }))
      .get(),
  };

  /* ===============================
     📊 POINTS TABLE
  =============================== */

  const pointsTable = $("#table tbody tr")
    .map((_: any, row: any) => {
      const td = $(row).find("td");

      return {
        team: td.eq(0).text().trim(),
        logo: td.eq(0).find("img").attr("src") || null,
        played: Number(td.eq(1).text().trim() || 0),
        wins: Number(td.eq(2).text().trim() || 0),
        losses: Number(td.eq(3).text().trim() || 0),
        nrr: td.eq(4).text().trim(),
        points: Number(td.eq(5).text().trim() || 0),
      };
    })
    .get();

  /* ===============================
     📊 TEAM COMPARISON
  =============================== */

  const overall = $(".table.colHeader tbody tr")
    .map((_: any, row: any) => {
      const td = $(row).find("td");

      return {
        team1: td.eq(0).text().trim(),
        metric: td.eq(1).text().trim(),
        team2: td.eq(2).text().trim(),
      };
    })
    .get();

  // ❗ Cheerio cannot click → venue same as overall (fallback)
  const venue = overall;

  const teams = {
    team1: {
      name: $(".team1 .team-name").text().trim(),
      logo: $(".team1 img").attr("src") || null,
    },
    team2: {
      name: $(".team2 .team-name").text().trim(),
      logo: $(".team2 img").attr("src") || null,
    },
  };

  /* ===============================
     🏟 VENUE DETAILS
  =============================== */

  const venueDetails = {
    name: $("#venue-details .title-text").text().trim(),
    weather: {
      temperature: $(".weather-temp").text().trim(),
      condition: $(".weather-cloudy-text").text().trim(),
      humidity: $(".humidity-text div").last().text().trim(),
      rainChance: $(".weather-place-hum-text").last().text().trim(),
    },
    stats: {
      matches: $(".match-count").text().trim(),
      winBatFirst: $(".win-bat-first .match-win-per").text().trim(),
      winBowlFirst: $(".venue-per .match-win-per").last().text().trim(),
      avg1stInns: $(".venue-avg-val").eq(0).text().trim(),
      avg2ndInns: $(".venue-avg-val").eq(1).text().trim(),
    },
    paceVsSpin: {
      paceWickets: $(".pace-text").next().text().trim(),
      spinWickets: $(".red-color").text().trim(),
      pacePercent: $(".s-format").eq(0).text().trim(),
      spinPercent: $(".s-format").eq(1).text().trim(),
    },
    recentMatches: $(".global-match-card")
      .map((_: any, el: any) => {
        const teams = $(el).find(".team-name");
        const scores = $(el).find(".team-score");
        const overs = $(el).find(".team-over");

        return {
          team1: teams.eq(0).text().trim(),
          team1Score: scores.eq(0).text().trim(),
          team1Overs: overs.eq(0).text().trim(),

          team2: teams.eq(1).text().trim(),
          team2Score: scores.eq(1).text().trim(),
          team2Overs: overs.eq(1).text().trim(),

          result: $(el).find(".match-dec-text").text().trim(),
          series: $(el).find(".series-name").text().trim(),

          url: "https://crex.com" + ($(el).attr("href") || ""),
        };
      })
      .get(), // ✅ IMPORTANT
  };

  /* ===============================
     ✅ FINAL MATCH (IMPORTANT)
  =============================== */

  return {
    teamForm,
    h2h,
    pointsTable,
    comparision: {
      teams,
      comparison: {
        overall,
        venue,
      },
    },
    venueDetails,
  };
};
