import requests
from bs4 import BeautifulSoup
import json

class scraperParse:

    question_array = []
    temp_answer_array = []

    def scrapeContest(self, level: str):
        base_url = "https://artofproblemsolving.com/wiki/index.php/"
        start_year = 2002
        end_year = 2021
        a = True

        for i in range(start_year, end_year):
            if a == True:
                letter = 'A'
            else:
                letter = 'B'
            self.findAnswers(str(i), letter)
            for j in range(1, 26):
                url = base_url + str(i) + '_AMC_' + '_' + level + letter + '_' + 'Problems/Problem_' + str(j)
                print(url)
                self.parseProblem(url, j, i, letter)

            if a == True:
                a = False
            else:
                a = True

    def parseProblem(self, url: str, problem_num: int, year: int, letter: str):
        page = requests.get(url)
        soup = BeautifulSoup(page.content, 'html.parser')
        html = list(soup.children)[2]
        body = list(html.children)[3]
        prob_box = soup.find_all("div", {"class": "mw-parser-output"})

        #Extract Problem
        problem = []

        pmark = soup.find("span", {"id": "Problem"})
        if pmark == None:
            pmark = soup.find("span", {"id": "Problem" + "_" + str(problem_num)})
        print(pmark)

        #if pmark is still None then we have an edge case. Break out of question
        if pmark == None:
            return

        for elt in pmark.parent.nextSiblingGenerator():
            if elt.name == "h2":
                break
            else:
                problem.append(str(elt))

        prob = "".join(problem)
        print(prob)


        #Extract Solution
        solution = []
        smark = soup.find("span", {"id": "Solution"})
        if smark == None:
            smark = soup.find("span", {"id": "Solution_1"})

        if smark == None:
            return

        print(smark)
        for elt in smark.parent.nextSiblingGenerator():
            if elt.name == "h2":
                break
            else:
                solution.append(str(elt))

        sol = "".join(solution)

        self.createJSONDump(prob, sol, problem_num, year, letter)

    def createJSONDump(self, problem: str, solution: str, problem_num: int, year: int, paper: str):
        question_obj = {}
        question_obj['year'] = year #int
        question_obj['number'] = problem_num #int
        question_obj['paper'] = paper #string (A, B)
        question_obj['problem'] = problem #string
        question_obj['solution'] = solution #string
        question_obj['answer_key'] = self.temp_answer_array[problem_num]

        question_json_obj = json.dumps(question_obj)

        print(question_json_obj)
        self.question_array.append(question_json_obj)

    def findAnswers(self, year: str, letter: str ):
        url = "https://artofproblemsolving.com/wiki/index.php/" + year + "_AMC_" + "10" + letter + "_Answer_Key"
        page = requests.get(url)
        soup = BeautifulSoup(page.content, 'html.parser')
        #Make answer array empty
        self.temp_answer_array = []

        ol = soup.find("ol")

        self.temp_answer_array = ol.findChildren("li", recursive=False)

        for i in range(len(self.temp_answer_array)):
            self.temp_answer_array[i] = self.temp_answer_array[i].get_text()



if __name__ == "__main__":

    sp = scraperParse()

    sp.scrapeContest('10')
    #sp.parseProblem('https://artofproblemsolving.com/wiki/index.php/2005_AMC__10B_Problems/Problem_10', 10, 2002, 'B')

    #sp.findAnswers(str(2019), 'A')
    #print(sp.question_array)



