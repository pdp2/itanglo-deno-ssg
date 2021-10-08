<!--
< postedOn: 2021-10-08
< postedBy: Paolo
-->

## Making a website

I was a bit stuck for things to write about, and I always resisted this idea because I thought it was too obvious, but sometimes obvious can be good. My plan is to write a series of posts that will go through the process of making a website. We will create a design brief for a hypothetical client and then plan out how we can go about completing the project.

### The brief

Our client is a local library for a fictional town called Lorem on Ipsum. They haven't had a website before but they would like to provide a system for the town folk to check what books are available, if they are currently loaned out and to reserve them. They would also like to list events that are taking place at the library and provide blog posts with book recommendations and other interesting content. The website should also provide  information about the library, how to contact them and a Frequently Answered Questions (FAQs) section to make it easier for users to find the information they are looking for. The content should be managed by a Content Management System (CMS) and this will be used by the library team that consists of three members of staff including Mrs Beale, library manager, Mr Grey, senior librarian and Miss Tobin the part-time library assistant. 

### Getting set up

When I first set foot in the wonderful world of web development, one of the things that surprised me is actually how little you need to start making websites. Over time as you acquire new skills and learn about different technologies you can add to your stack of tools, but to begin with all you need to get going is a web browser and a code editor. I personally use [Chrome](https://www.google.com/intl/en_uk/chrome/) as my web browser and [VS Code](https://code.visualstudio.com/) as my code editor. Of course, you can choose whatever you like from the many options available.

### A simple web page

Websites are a collection of files that are provided by servers connected to the world wide web and accessed via your web browser. The main content of a website is contained in HTML files, which stands for HyperText Markup Language and is the standard language for displaying documents in web browsers. In future posts I plan to write about other languages that are used to build websites such as Cascading Style Sheets (CSS) and JavaScript (JS), but to begin with, all we need to start seeing content in a web browser is good old trusty HTML.

HTML documents are made up of tags, which are used to semantically structure content. This means that the tag used to display the content is suited for the type of content that is being shown. For example, if you wanted to display a paragraph of text, you would use a `&lt;p&gt;` tag. Below is an example of how you would define a paragraph of text in HTML:

```
&lt;p&gt;This is a paragraph of text in HTML.&lt;/p&gt;
```

Notice in the example above how the text is wrapped by both an opening `&lt;p&gt;` tag and a closing `&lt;/p&gt;` tag. This is typical in HTML, especially for tags that can contain other nested tags, however there are also self-closing tags that don't require a closing tag. An example of a self closing tag is the `&lt;img&gt;` tag which is used to display an image (see, semantic). To use an image tag you need to provide a `src`, where the image you want to display is located on you computer, and some `alt` text which is a description of what can be seen in the image. The `alt` text is important because it is used by screen reading software which gives blind or visually impaired users the opportunity to use a website by reading out the content of the page and in this case a description of what is in the image. Below is an example of how you would include an image on your page:

```
&lt;img src="images/penguins-dancing.jpg" alt="A photo of penguins dancing"&gt;
```

In HTML, a tag can have many attributes. In the example above, `src` and `alt` are referred to as HTML attributes. They provide information to the browser about the HTML tag. Tags are often nested inside each other, for instance if you want to display a paragraph of text that contains a link you would write something like the following:

```
&lt;p&gt;A paragraph containing a &lt;a href="https://google.com"&gt;link to Google&lt;/a&gt;
```

Here we have introduced the `&lt;a&gt;` tag, also known as the anchor tag. The text inside the opening and closing tags is what will be displayed in the browser and the value of the `href` attribute is the URL of the page the user will be taken to upon clicking the link.

To bring these example to life, let's make a start on our project for the Lorem on Ipsum library. Create a folder called `lorem-on-ipsum-library` somewhere on you computer. It's conventional to keep folder names in lower case and to replace any spaces with hyphens when working on a web project. Inside this newly created folder create an HTML file called `index.html`. This file will include the main content and structure of our webpage. Below is what the bare bones of our web page should look like to start with:

```
&lt;!DOCTYPE html&gt;
&lt;html lang="en"&gt;
    &lt;head&gt;
        &lt;meta charset="UTF-8"&gt;
        &lt;meta name="viewport" content="width=device-width, initial-scale=1.0"&gt;
        &lt;title&gt;Lorem on Ipsum Library&lt;/title&gt;
    &lt;/head&gt;
    &lt;body&gt;
        &lt;h1&gt;Lorem on Ipsum Library&lt;/h1&gt;
        &lt;p&gt;More stuff will be here later.&lt;/p&gt;
    &lt;/body&gt;
&lt;/html&gt;
```

Copy the code above and paste it into your `index.html` file and then we'll take a minute to go through what's going on here as there may be some new tags that we are not familiar with yet. Right at the top we have the document type, this tells the browser that it can expect to see HTML in this file. Next we have the parent `&lt;html&gt;` container and as you can see this has an attribute called `lang` which tells the browser that the language used in this file will be English. Notice that the `&lt;head&gt;` tag that follows is slightly indented, this serves to indicate that this tag is nested inside the previous tag. The browser does not care about the indentation, however it will make it easier for you or any other developer to see what is going on and to make any changes later down the line. Inside the `&lt;head&gt;` tag there are a couple of `&lt;meta&gt;` tags and a `&lt;title&gt;` tag. `&lt;meta&gt;` tags are used to provide information about the document to the browser. The first example we see here has an attribute `charset` with a value of `UTF-8`. This ensures that the character encoding for the document follows the [UTF-8](https://en.wikipedia.org/wiki/UTF-8) standard. The second `&lt;meta&gt;` tag provides information about the viewport and we will be looking at the difference this makes in a later post when we explore how web pages are displayed on mobile devices. Finally we have the `&lt;title&gt;` and this allows us to provide the title of the web page which is displayed in the browser tab. The `&lt;head&gt;` of an HTML document is not used to display anything on the page, this area is reserved to contain information about the page and to link to additional resources that might be required by the page such as CSS or JS files.

At the same level as the `&lt;head&gt;` tag we have the `&lt;body&gt;` tag. Tags that are at the same level and share a parent tag are referred to as siblings. Now the `&lt;body&gt;` tag is where the action happens, this is where we start to see stuff appear on the screen. Inside the `&lt;body&gt;` tag we have another couple of HTML elements, the `&lt;h1&gt;` and the `&lt;p&gt;` tags. We've already seen examples of the `&lt;p&gt;` tag so we know what that is for, however the `&lt;h1&gt;` represents the most important heading on the page, in this case the name of the website. There are several heading tags available in HTML and each one indicates a level of importance. The heading tags range from `&lt;h1&gt;` to `&lt;h6&gt;`, where `&lt;h1&gt;` is the most important and `&lt;h6&gt;` is the least. 

We are now ready to see our web page in action, make sure you have saved your `index.html` file after pasting the code from the example above and then right click on the file and select 'Open with Chrome' or the browser of your choice. When the page loads you should see something similar to the screenshot below:

![Screenshot of the bare bones of our Lorem on Ipsum library website](./docs/images/loi-library-bare-bones.jpg)

It might not be much to look at right now, but with each blog post we will be adding more content and making improvements to the website whilst learning about the fundamental building blocks of web development. I hope you have enjoyed reading this post and that I will have a new one ready for you soon. In the meantime, feel free to experiment with this page, try out new tags, add some content and have a bit of fun. One of the aspects of web development that I enjoy the most is that a website is a living document, it changes and evolves over time and there are always opportunities to make it better. Thank you for reading.
